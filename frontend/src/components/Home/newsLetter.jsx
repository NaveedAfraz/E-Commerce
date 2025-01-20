import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Mail, ChevronRight, X } from 'lucide-react';

const HomePromotions = () => {
  const [email, setEmail] = useState('');
  const [showPromo, setShowPromo] = useState(true);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Promotional Banner */}
      {showPromo && (
        <Alert className="bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4" />
          <AlertTitle>Limited Time Offer!</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Get 20% off on your first purchase with code: WELCOME20</span>
            <Button variant="ghost" size="sm" onClick={() => setShowPromo(false)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Newsletter Section */}
      <div className="bg-gray-100 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6 ">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Join Our Newsletter</h3>
          <p className="text-gray-600">
            Subscribe to get special offers, free giveaways, and exclusive deals.
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-2 hover:shadow-2xl transition-shadow">
          <div className="relative flex-1 md:flex-initial">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 " />
            <Input
              type="email"
              placeholder="Enter your email"
              className="pl-10 min-w-[300px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button className="shrink-0">
            Subscribe
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-b hover:shadow-2xl transition-shadow">
        <div className="text-center space-y-2">
          <div className="font-bold text-2xl">100K+</div>
          <div className="text-sm text-gray-600">Happy Customers</div>
        </div>
        <div className="text-center space-y-2">
          <div className="font-bold text-2xl">50K+</div>
          <div className="text-sm text-gray-600">Products Available</div>
        </div>
        <div className="text-center space-y-2">
          <div className="font-bold text-2xl">24/7</div>
          <div className="text-sm text-gray-600">Customer Support</div>
        </div>
        <div className="text-center space-y-2">
          <div className="font-bold text-2xl">4.8/5</div>
          <div className="text-sm text-gray-600">Customer Rating</div>
        </div>
      </div>
    </div>
  );
};

export default HomePromotions;