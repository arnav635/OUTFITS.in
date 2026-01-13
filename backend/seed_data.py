import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

products = [
    {
        "id": "prod_001",
        "name": "Premium Cotton Shirt",
        "category": "men",
        "subcategory": "shirts",
        "description": "Luxury cotton shirt with premium finish",
        "base_price": 89.99,
        "images": [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"
        ],
        "customization_options": {
            "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
            "fits": ["Slim", "Regular", "Oversized"],
            "colors": ["White", "Black", "Navy", "Grey"],
            "fabrics": ["Cotton", "Premium Cotton", "Linen"],
            "sleeves": ["Half", "Full"]
        }
    },
    {
        "id": "prod_002",
        "name": "Classic T-Shirt",
        "category": "men",
        "subcategory": "tshirts",
        "description": "Essential cotton t-shirt",
        "base_price": 39.99,
        "images": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"
        ],
        "customization_options": {
            "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
            "fits": ["Slim", "Regular", "Oversized"],
            "colors": ["White", "Black", "Grey", "Navy", "Olive"],
            "fabrics": ["Cotton", "Premium Cotton"],
            "sleeves": ["Half", "Full", "Sleeveless"]
        }
    },
    {
        "id": "prod_003",
        "name": "Tailored Pants",
        "category": "men",
        "subcategory": "pants",
        "description": "Modern tailored pants for any occasion",
        "base_price": 119.99,
        "images": [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800"
        ],
        "customization_options": {
            "sizes": ["28", "30", "32", "34", "36", "38"],
            "fits": ["Slim", "Regular", "Relaxed"],
            "colors": ["Black", "Navy", "Grey", "Khaki"],
            "fabrics": ["Cotton", "Linen"]
        }
    },
    {
        "id": "prod_004",
        "name": "Luxury Hoodie",
        "category": "men",
        "subcategory": "hoodies",
        "description": "Premium cotton hoodie with soft finish",
        "base_price": 149.99,
        "images": [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"
        ],
        "customization_options": {
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "fits": ["Regular", "Oversized"],
            "colors": ["Black", "Grey", "Navy", "Beige"],
            "fabrics": ["Cotton", "Premium Cotton"]
        }
    },
    {
        "id": "prod_005",
        "name": "Elegant Dress",
        "category": "women",
        "subcategory": "dresses",
        "description": "Sophisticated dress for special occasions",
        "base_price": 189.99,
        "images": [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
        ],
        "customization_options": {
            "sizes": ["XS", "S", "M", "L", "XL"],
            "fits": ["Slim", "Regular"],
            "colors": ["Black", "Red", "Navy", "Emerald"],
            "fabrics": ["Silk", "Satin"]
        }
    },
    {
        "id": "prod_006",
        "name": "Women's Shirt",
        "category": "women",
        "subcategory": "shirts",
        "description": "Classic button-up shirt",
        "base_price": 79.99,
        "images": [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
        ],
        "customization_options": {
            "sizes": ["XS", "S", "M", "L", "XL"],
            "fits": ["Slim", "Regular", "Oversized"],
            "colors": ["White", "Black", "Pink", "Blue"],
            "fabrics": ["Cotton", "Silk", "Linen"],
            "sleeves": ["Half", "Full", "Sleeveless"]
        }
    },
    {
        "id": "prod_007",
        "name": "Designer Top",
        "category": "women",
        "subcategory": "tops",
        "description": "Stylish top for everyday wear",
        "base_price": 59.99,
        "images": [
            "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800"
        ],
        "customization_options": {
            "sizes": ["XS", "S", "M", "L", "XL"],
            "fits": ["Slim", "Regular"],
            "colors": ["White", "Black", "Beige", "Coral"],
            "fabrics": ["Cotton", "Silk"],
            "sleeves": ["Half", "Full", "Sleeveless"]
        }
    },
    {
        "id": "prod_008",
        "name": "Tailored Pants",
        "category": "women",
        "subcategory": "pants",
        "description": "Professional pants with perfect fit",
        "base_price": 109.99,
        "images": [
            "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800"
        ],
        "customization_options": {
            "sizes": ["XS", "S", "M", "L", "XL"],
            "fits": ["Slim", "Regular", "Wide"],
            "colors": ["Black", "Navy", "Grey", "White"],
            "fabrics": ["Cotton", "Linen"]
        }
    }
]

async def seed_database():
    await db.products.delete_many({})
    await db.products.insert_many(products)
    print(f"Seeded {len(products)} products")
    
    admin_user = {
        "id": "admin_001",
        "email": "admin@outfits.com",
        "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6PgXZu",
        "name": "Arnav Pawar",
        "role": "admin",
        "created_at": "2025-01-01T00:00:00"
    }
    
    existing_admin = await db.users.find_one({"email": "admin@outfits.com"})
    if not existing_admin:
        await db.users.insert_one(admin_user)
        print("Created admin user: admin@outfits.com / password123")

if __name__ == "__main__":
    asyncio.run(seed_database())
