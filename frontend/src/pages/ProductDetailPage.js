import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import useStore from '../store/useStore';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, user } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [customization, setCustomization] = useState({
    size: '',
    fit: '',
    color: '',
    fabric: '',
    sleeve: '',
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      
      const opts = response.data.customization_options;
      setCustomization({
        size: opts.sizes?.[0] || '',
        fit: opts.fits?.[0] || '',
        color: opts.colors?.[0] || '',
        fabric: opts.fabrics?.[0] || '',
        sleeve: opts.sleeves?.[0] || '',
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    const cartItem = {
      product_id: product.id,
      customization,
      quantity: 1,
      price: calculatePrice(),
    };

    try {
      await api.post('/cart', cartItem);
      addToCart(cartItem);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/auth');
      return;
    }

    try {
      await api.post('/wishlist', { product_id: product.id });
      addToWishlist({ product_id: product.id });
      toast.success('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const calculatePrice = () => {
    let price = product.base_price;
    if (customization.fabric === 'Silk' || customization.fabric === 'Satin') {
      price += 50;
    } else if (customization.fabric === 'Premium Cotton') {
      price += 20;
    }
    return price;
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="product-detail-page" className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((img, index) => (
              <button
                key={index}
                data-testid={`image-thumbnail-${index}`}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 overflow-hidden border-2 transition-all ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 md:sticky md:top-32 md:h-fit"
        >
          <div>
            <h1 className="text-4xl font-serif font-medium mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold">${calculatePrice()}</p>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-bold mb-2 block">Size</label>
              <Select value={customization.size} onValueChange={(value) => setCustomization({ ...customization, size: value })}>
                <SelectTrigger data-testid="size-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.customization_options.sizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-bold mb-2 block">Fit</label>
              <Select value={customization.fit} onValueChange={(value) => setCustomization({ ...customization, fit: value })}>
                <SelectTrigger data-testid="fit-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.customization_options.fits.map((fit) => (
                    <SelectItem key={fit} value={fit}>{fit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-bold mb-2 block">Color</label>
              <div className="flex gap-2">
                {product.customization_options.colors.map((color) => (
                  <button
                    key={color}
                    data-testid={`color-${color}`}
                    onClick={() => setCustomization({ ...customization, color })}
                    className={`px-4 py-2 text-sm border transition-all ${
                      customization.color === color ? 'border-primary bg-primary text-white' : 'border-border'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-bold mb-2 block">Fabric</label>
              <Select value={customization.fabric} onValueChange={(value) => setCustomization({ ...customization, fabric: value })}>
                <SelectTrigger data-testid="fabric-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.customization_options.fabrics.map((fabric) => (
                    <SelectItem key={fabric} value={fabric}>{fabric}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {product.customization_options.sleeves && (
              <div>
                <label className="text-xs uppercase tracking-widest font-bold mb-2 block">Sleeve</label>
                <Select value={customization.sleeve} onValueChange={(value) => setCustomization({ ...customization, sleeve: value })}>
                  <SelectTrigger data-testid="sleeve-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.customization_options.sleeves.map((sleeve) => (
                      <SelectItem key={sleeve} value={sleeve}>{sleeve}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button data-testid="add-to-cart-button" onClick={handleAddToCart} className="btn-primary flex-1">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              data-testid="add-to-wishlist-button"
              onClick={handleAddToWishlist}
              variant="outline"
              className="h-12 px-6"
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
