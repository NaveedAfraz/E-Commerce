import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Address } from "@/components/ShoppingLayout/address";
import { useLocation, useNavigate } from "react-router-dom";
import ShoppingOrders from "@/components/ShoppingLayout/ShoppingOrders";

export default function Account() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentTab, setCurrentTab] = useState("orders"); // Default tab
  const navigate = useNavigate();
  const location = useLocation();

  // Sync currentTab with the URL
  useEffect(() => {
    if (location.pathname.includes("/shopping/account/address")) {
      setCurrentTab("address");
    } else {
      setCurrentTab("orders");
    }
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative">
        {/* Hero Image */}
        <img
          src="/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg"
          className="h-[550px] w-full object-cover object-center"
          alt="Hero background"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black/100"></div>
      </div>

      {/* Tabs Section */}
      <div className="flex justify-center mt-[-170px]">
        <div className="w-full max-w-4xl rounded-t-lg border border-gray-300 backdrop-blur-md p-6 shadow-lg">
          <Tabs
            value={currentTab}
            onValueChange={(value) => {
              if (value === "orders") navigate("/shopping/account/orders");
              else if (value === "address")
                navigate("/shopping/account/address");
            }}
            className="w-full"
          >
            <TabsList className="bg-transparent flex space-x-4">
              <TabsTrigger
                value="orders"
                className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded"
              >
                Address
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-4">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="mt-4">
              <Address
                showAddressForm={showAddressForm}
                setShowAddressForm={setShowAddressForm}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Content Spacer */}
      <div className="flex-grow"></div>

      {/* Footer */}
      
    </div>
  );
}
