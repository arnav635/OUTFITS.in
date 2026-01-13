import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer data-testid="main-footer" className="bg-primary text-primary-foreground py-24">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-serif font-semibold mb-6">OUTFITS</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Premium fashion by American Outfits. Founded by Arnav Pawar.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Shop</h4>
            <div className="space-y-4">
              <Link to="/products/men" className="block text-sm hover:underline">
                Men's Collection
              </Link>
              <Link to="/products/women" className="block text-sm hover:underline">
                Women's Collection
              </Link>
              <Link to="/ai-stylist" className="block text-sm hover:underline">
                AI Stylist
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Help</h4>
            <div className="space-y-4">
              <a href="#" className="block text-sm hover:underline">
                Contact Us
              </a>
              <a href="#" className="block text-sm hover:underline">
                Shipping Info
              </a>
              <a href="#" className="block text-sm hover:underline">
                Returns
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-xs text-primary-foreground/60">
            © 2025 American Outfits. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;