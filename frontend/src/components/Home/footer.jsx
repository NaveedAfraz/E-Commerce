import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  RefreshCcw,
  Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <Truck className="w-8 h-8 text-gray-400" />
            <div>
              <h4 className="font-semibold">Free Shipping</h4>
              <p className="text-sm text-gray-400">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RefreshCcw className="w-8 h-8 text-gray-400" />
            <div>
              <h4 className="font-semibold">Easy Returns</h4>
              <p className="text-sm text-gray-400">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
            <div>
              <h4 className="font-semibold">Secure Payment</h4>
              <p className="text-sm text-gray-400">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-gray-400" />
            <div>
              <h4 className="font-semibold">24/7 Support</h4>
              <p className="text-sm text-gray-400">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm leading-relaxed mb-4">
              We're dedicated to providing the best shopping experience with quality products and exceptional service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Shop</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-white transition-colors">My Account</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Orders History</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Wishlist</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Shipping Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span className="text-sm">123 Commerce St, City, State 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span className="text-sm">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span className="text-sm">support@yourstore.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {currentYear} Your Store Name. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;