import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const ProductsPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products?category=${category}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="products-page" className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-12 capitalize">
          {category}'s Collection
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <motion.div
                data-testid={`product-card-${index}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="product-card group"
              >
                <div className="relative overflow-hidden aspect-[3/4] mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover product-image-transition"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                <p className="text-lg font-semibold">${product.base_price}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductsPage;