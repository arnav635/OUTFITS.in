from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import socketio
import bcrypt
import jwt
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
)

app = FastAPI()
socket_app = socketio.ASGIApp(sio, app)
api_router = APIRouter(prefix="/api")

JWT_SECRET = os.getenv('JWT_SECRET')
JWT_ALGORITHM = 'HS256'

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: str = "customer"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    subcategory: str
    description: str
    base_price: float
    images: List[str]
    customization_options: Dict[str, Any]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItem(BaseModel):
    product_id: str
    customization: Dict[str, str]
    quantity: int
    price: float

class WishlistItem(BaseModel):
    product_id: str

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[CartItem]
    total_amount: float
    status: str = "pending"
    payment_status: str = "pending"
    payment_session_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    items: List[CartItem]
    total_amount: float

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/signup")
async def signup(user: UserCreate):
    existing = await db.users.find_one({"email": user.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    user_obj = User(email=user.email, name=user.name)
    user_dict = user_obj.model_dump()
    user_dict['password'] = hashed_password.decode('utf-8')
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    token = create_token(user_obj.id, user_obj.email, user_obj.role)
    return {"token": token, "user": user_obj.model_dump()}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), user['password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'], user['email'], user.get('role', 'customer'))
    del user['password']
    return {"token": token, "user": user}

@api_router.get("/products")
async def get_products(category: Optional[str] = None):
    query = {}
    if category:
        query['category'] = category
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/cart")
async def add_to_cart(item: CartItem, current_user: dict = Depends(get_current_user)):
    user_id = current_user['user_id']
    cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    
    if not cart:
        cart = {"user_id": user_id, "items": []}
    
    cart['items'].append(item.model_dump())
    await db.carts.update_one(
        {"user_id": user_id},
        {"$set": cart},
        upsert=True
    )
    return {"message": "Item added to cart"}

@api_router.get("/cart")
async def get_cart(current_user: dict = Depends(get_current_user)):
    user_id = current_user['user_id']
    cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    return cart if cart else {"user_id": user_id, "items": []}

@api_router.post("/wishlist")
async def add_to_wishlist(item: WishlistItem, current_user: dict = Depends(get_current_user)):
    user_id = current_user['user_id']
    await db.wishlists.update_one(
        {"user_id": user_id},
        {"$addToSet": {"items": item.model_dump()}},
        upsert=True
    )
    return {"message": "Item added to wishlist"}

@api_router.get("/wishlist")
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    user_id = current_user['user_id']
    wishlist = await db.wishlists.find_one({"user_id": user_id}, {"_id": 0})
    return wishlist if wishlist else {"user_id": user_id, "items": []}

@api_router.post("/orders")
async def create_order(order_data: OrderCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user['user_id']
    order = Order(user_id=user_id, items=order_data.items, total_amount=order_data.total_amount)
    order_dict = order.model_dump()
    order_dict['created_at'] = order_dict['created_at'].isoformat()
    
    await db.orders.insert_one(order_dict)
    await db.carts.delete_one({"user_id": user_id})
    
    await sio.emit('new_order', order_dict)
    
    return order_dict

@api_router.get("/orders")
async def get_orders(current_user: dict = Depends(get_current_user)):
    user_id = current_user['user_id']
    role = current_user.get('role', 'customer')
    
    if role == 'admin':
        orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    else:
        orders = await db.orders.find({"user_id": user_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    return orders

@api_router.post("/payments/create-checkout")
async def create_checkout(request: Request, current_user: dict = Depends(get_current_user)):
    body = await request.json()
    amount = body.get('amount')
    currency = body.get('currency', 'usd')
    metadata = body.get('metadata', {})
    
    host_url = body.get('host_url')
    success_url = f"{host_url}/checkout-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}/checkout"
    
    stripe_checkout = StripeCheckout(
        api_key=os.getenv('STRIPE_API_KEY'),
        webhook_url=f"{host_url}/api/webhook/stripe"
    )
    
    checkout_request = CheckoutSessionRequest(
        amount=float(amount),
        currency=currency,
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={**metadata, "user_id": current_user['user_id']}
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "user_id": current_user['user_id'],
        "amount": amount,
        "currency": currency,
        "status": "pending",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, current_user: dict = Depends(get_current_user)):
    stripe_checkout = StripeCheckout(
        api_key=os.getenv('STRIPE_API_KEY'),
        webhook_url=""
    )
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {
            "status": status.status,
            "payment_status": status.payment_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    if status.payment_status == "paid":
        await db.orders.update_one(
            {"payment_session_id": session_id},
            {"$set": {"payment_status": "paid", "status": "confirmed"}}
        )
    
    return status.model_dump()

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    stripe_checkout = StripeCheckout(
        api_key=os.getenv('STRIPE_API_KEY'),
        webhook_url=""
    )
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/ai/style-recommendation")
async def get_style_recommendation(request: Request, current_user: dict = Depends(get_current_user)):
    body = await request.json()
    preferences = body.get('preferences', {})
    
    chat = LlmChat(
        api_key=os.getenv('EMERGENT_LLM_KEY'),
        session_id=f"style_{current_user['user_id']}",
        system_message="You are a premium fashion stylist AI. Provide personalized outfit recommendations based on user preferences."
    ).with_model("openai", "gpt-5.2")
    
    prompt = f"""User preferences:
- Gender: {preferences.get('gender', 'any')}
- Occasion: {preferences.get('occasion', 'casual')}
- Color preference: {preferences.get('color', 'any')}
- Fit preference: {preferences.get('fit', 'regular')}

Recommend 3 complete outfits with specific items (shirts, pants, etc.) that would work well together."""
    
    user_message = UserMessage(text=prompt)
    response = await chat.send_message(user_message)
    
    return {"recommendation": response}

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()