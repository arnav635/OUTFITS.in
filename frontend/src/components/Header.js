import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import useStore from '../store/useStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, wishlist, user, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      data-testid="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-6 md:px-12 lg:px-24 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" data-testid="logo-link" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-semibold tracking-tight">OUTFITS</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/products/men"
              data-testid="nav-men"
              className="text-sm uppercase tracking-widest font-bold hover:text-primary transition-colors"
            >
              Men
            </Link>
            <Link
              to="/products/women"
              data-testid="nav-women"
              className="text-sm uppercase tracking-widest font-bold hover:text-primary transition-colors"
            >
              Women
            </Link>
            <Link
              to="/ai-stylist"
              data-testid="nav-ai-stylist"
              className="text-sm uppercase tracking-widest font-bold hover:text-primary transition-colors"
            >
              AI Stylist
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            <Link to="/wishlist" data-testid="wishlist-icon" className="relative hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" data-testid="cart-icon" className="relative hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <User data-testid="user-icon" className="w-5 h-5 cursor-pointer" />
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/profile"
                    data-testid="profile-link"
                    className="block px-4 py-3 text-sm hover:bg-muted transition-colors"
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      data-testid="admin-link"
                      className="block px-4 py-3 text-sm hover:bg-muted transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    data-testid="logout-button"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" data-testid="login-link" className="text-sm uppercase tracking-widest font-bold">
                Login
              </Link>
            )}
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-6 pb-6 space-y-4"
          >
            <Link
              to="/products/men"
              data-testid="mobile-nav-men"
              className="block text-sm uppercase tracking-widest font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Men
            </Link>
            <Link
              to="/products/women"
              data-testid="mobile-nav-women"
              className="block text-sm uppercase tracking-widest font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Women
            </Link>
            <Link
              to="/ai-stylist"
              data-testid="mobile-nav-ai-stylist"
              className="block text-sm uppercase tracking-widest font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Stylist
            </Link>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;