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
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-b border-gray-700 pb-6 mb-6">
          {[
            {
              icon: <Truck className="w-6 h-6 text-gray-400" />,
              title: 'Free Shipping',
              description: 'On orders over $100',
            },
            {
              icon: <RefreshCcw className="w-6 h-6 text-gray-400" />,
              title: 'Easy Returns',
              description: '30-day return policy',
            },
            {
              icon: <CreditCard className="w-6 h-6 text-gray-400" />,
              title: 'Secure Payment',
              description: '100% secure checkout',
            },
            {
              icon: <Clock className="w-6 h-6 text-gray-400" />,
              title: '24/7 Support',
              description: 'Always here to help',
            },
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              {feature.icon}
              <div>
                <h4 className="font-semibold text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-base mb-3">About Us</h3>
            <p className="text-xs leading-relaxed mb-3">
              We're dedicated to providing the best shopping experience with quality products and exceptional service.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a key={index} href="#" className="hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shopping/home" className="text-xs hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shopping/listings" className="text-xs hover:text-white transition-colors">Shop</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-base mb-3">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/shopping/account" className="text-xs hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/shopping/account/orders" className="text-xs hover:text-white transition-colors">Orders History</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-base mb-3">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="text-xs">123 Commerce St, City, State 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-xs">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-xs">support@yourstore.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs">
              © {currentYear} EliteWardrobe. All rights reserved.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-xs hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-xs hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
