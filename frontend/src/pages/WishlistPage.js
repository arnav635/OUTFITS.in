import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import useStore from '../store/useStore';
import { Button } from '../components/ui/button';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useStore();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div data-testid="wishlist-page" className="pt-32 pb-24 px-6 md:px-12 lg:px-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-serif font-medium mb-4">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mb-8">Save items you love</p>
          <Button onClick={() => navigate('/products/men')} className="btn-primary">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="wishlist-page" className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-12">Your Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((item, index) => (
            <motion.div
              key={item.product_id}
              data-testid={`wishlist-item-${index}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="aspect-[3/4] bg-muted mb-4" />
              <button
                data-testid={`remove-wishlist-${index}`}
                onClick={() => removeFromWishlist(item.product_id)}
                className="absolute top-4 right-4 bg-white p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WishlistPage;