import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

const HomePage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div data-testid="home-page">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1748973752140-19c6692772d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMGVkaXRvcmlhbCUyMG1vZGVsJTIwc3RyZWV0JTIwc3R5bGV8ZW58MHx8fHwxNzY4MzAyNzMwfDA&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        </div>

        <motion.div
          className="relative z-10 text-center px-6 text-white"
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.h1
            variants={fadeIn}
            className="text-6xl md:text-8xl font-serif font-medium tracking-tight leading-[0.9] mb-6"
          >
            Premium Fashion
            <br />
            Redefined
          </motion.h1>
          <motion.p variants={fadeIn} className="text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            Discover the finest collection of customizable luxury apparel
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products/men">
              <Button data-testid="hero-shop-men" className="btn-primary group">
                Shop Men
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/products/women">
              <Button data-testid="hero-shop-women" className="btn-primary group">
                Shop Women
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-4">Collections</h2>
          <p className="text-lg font-light text-muted-foreground">Curated for the modern individual</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/products/men">
            <motion.div
              data-testid="men-collection-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="product-card relative h-[500px] overflow-hidden group"
            >
              <img
                src="https://images.unsplash.com/photo-1614188443400-0050360d6c23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzY4MzAyNzMxfDA&ixlib=rb-4.1.0&q=85"
                alt="Men's Collection"
                className="w-full h-full object-cover product-image-transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-3xl font-serif font-medium mb-2">Men's Collection</h3>
                  <p className="text-sm uppercase tracking-widest">Explore Now</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to="/products/women">
            <motion.div
              data-testid="women-collection-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="product-card relative h-[500px] overflow-hidden group"
            >
              <img
                src="https://images.unsplash.com/photo-1709887139259-e5fdce21afa8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBlZGl0b3JpYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjgzMDI3MzN8MA&ixlib=rb-4.1.0&q=85"
                alt="Women's Collection"
                className="w-full h-full object-cover product-image-transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-3xl font-serif font-medium mb-2">Women's Collection</h3>
                  <p className="text-sm uppercase tracking-widest">Explore Now</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-muted">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-6">AI-Powered Styling</h2>
          <p className="text-lg font-light leading-relaxed mb-8 text-muted-foreground">
            Experience personalized fashion recommendations tailored to your unique style and preferences
          </p>
          <Link to="/ai-stylist">
            <Button data-testid="ai-stylist-cta" className="btn-primary group">
              Try AI Stylist
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;