import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Address } from "@/components/ShoppingLayout/address";
import { useLocation, useNavigate } from "react-router-dom";
import Orders from "@/components/AdminLayout/orders";
import ShoppingOrders from "@/components/ShoppingLayout/ShoppingOrders";

export default function Account() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine default tab value based on pathname
  const defaultTab = location.pathname.includes("address")
    ? "address"
    : "orders";

  // const handleTabChange = (value) => {
  //   navigate(`${value}`); // Update the pathname dynamically
  // };
  return (
    <div className="flex flex-col">
      {/* Hero section with gradient overlay */}
      <div className="relative h-[550px]">
        {/* Background image */}
        <img
          src="/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg"
          className="absolute h-full w-full object-cover object-center"
          alt="Hero background"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black/80" />
        {/* Tabs positioned slightly above the bottom of hero */}

        <div className="container mx-auto mt-96">
          <div className="rounded-t-lg border border-gray-300 border-opacity-50 bg-/0 backdrop-blur-sm p-6 shadoaw-sm">
            <Tabs defaultValue="defaultTab" className="w-full">
              <TabsList className="bg-transparent">
                <TabsTrigger value="orders"> Orders</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>
              <TabsContent value="orders">
                <ShoppingOrders />
              </TabsContent>
              <TabsContent value="address">
                <Address
                  showAddressForm={showAddressForm}
                  setShowAddressForm={setShowAddressForm}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
