import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../services/api';
import useStore from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const CheckoutPage = () => {
  const { cart, user, clearCart } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      
      const orderResponse = await api.post('/orders', {
        items: cart,
        total_amount: total,
      });

      const hostUrl = window.location.origin;
      const paymentResponse = await api.post('/payments/create-checkout', {
        amount: total,
        currency: 'usd',
        host_url: hostUrl,
        metadata: {
          order_id: orderResponse.data.id,
        },
      });

      window.location.href = paymentResponse.data.url;
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div data-testid="checkout-page" className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-medium mb-6">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" data-testid="checkout-name" placeholder="Enter your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" data-testid="checkout-email" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" data-testid="checkout-address" placeholder="Street address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" data-testid="checkout-city" placeholder="City" />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" data-testid="checkout-zip" placeholder="ZIP" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border border-border p-8 sticky top-32">
              <h2 className="text-2xl font-serif font-medium mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>Item {index + 1}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                data-testid="place-order-button"
                onClick={handlePayment}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;