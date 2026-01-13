import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import useStore from '../store/useStore';
import { Button } from '../components/ui/button';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('checking');
  const { clearCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus();
    }
  }, [sessionId]);

  const pollPaymentStatus = async (attempts = 0) => {
    if (attempts >= 5) {
      setStatus('timeout');
      return;
    }

    try {
      const response = await api.get(`/payments/status/${sessionId}`);
      
      if (response.data.payment_status === 'paid') {
        setStatus('success');
        clearCart();
        return;
      } else if (response.data.status === 'expired') {
        setStatus('failed');
        return;
      }

      setTimeout(() => pollPaymentStatus(attempts + 1), 2000);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
    }
  };

  return (
    <div data-testid="checkout-success-page" className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {status === 'checking' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-primary" />
            <h1 className="text-4xl font-serif font-medium mb-4">Processing Payment</h1>
            <p className="text-muted-foreground">Please wait while we confirm your order...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-600" />
            <h1 className="text-4xl font-serif font-medium mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">Thank you for your purchase. Your order has been confirmed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/profile')} className="btn-primary">
                View Orders
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                Continue Shopping
              </Button>
            </div>
          </>
        )}

        {(status === 'failed' || status === 'timeout' || status === 'error') && (
          <>
            <h1 className="text-4xl font-serif font-medium mb-4">Payment Failed</h1>
            <p className="text-muted-foreground mb-8">There was an issue processing your payment. Please try again.</p>
            <Button onClick={() => navigate('/checkout')} className="btn-primary">
              Try Again
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutSuccessPage;