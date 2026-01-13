import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import { Button } from '../components/ui/button';

const CartPage = () => {
  const { cart, removeFromCart, user } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div data-testid="cart-page" className="pt-32 pb-24 px-6 md:px-12 lg:px-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-serif font-medium mb-4">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8">Start shopping to add items</p>
          <Button onClick={() => navigate('/products/men')} className="btn-primary">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="cart-page" className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item, index) => (
              <motion.div
                key={index}
                data-testid={`cart-item-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 border border-border p-6"
              >
                <div className="w-32 h-32 flex-shrink-0">
                  <div className="w-full h-full bg-muted" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Product Item</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Size: {item.customization.size} | Fit: {item.customization.fit} | Color: {item.customization.color}
                  </p>
                  <p className="text-lg font-semibold">${item.price}</p>
                </div>
                <button
                  data-testid={`remove-item-${index}`}
                  onClick={() => removeFromCart(index)}
                  className="hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-border p-8 sticky top-32">
              <h2 className="text-2xl font-serif font-medium mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button data-testid="checkout-button" onClick={handleCheckout} className="btn-primary w-full">
                Proceed to Checkout
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;