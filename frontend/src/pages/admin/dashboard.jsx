import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { topSellingProducts } from "@/store/admin-Slice/admin-Order";

export default function Dashboard() {
  const [topSellingProduct, setTopSellingProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      dispatch(topSellingProducts()).then((res) => {
        console.log(res);
        setTopSellingProduct(res.payload.data);
      });
      setLoading(false);
    };

    fetchTopSellingProducts();
  }, []);

  console.log(topSellingProduct);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Dashboard</h1>

      <Card className="shadow-lg">
        <CardHeader className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4">
          <CardTitle className="text-lg sm:text-xl">Top-Selling Products</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              {/* Replace with the ShadCN Spinner component */}
              <div className="spinner"></div>
            </div>
          ) : topSellingProduct.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {topSellingProduct.map((product) => (
                <div
                  key={product.productID}
                  className="flex border rounded-lg shadow-sm p-4 bg-white"
                >
                  <img
                    src={
                      product.productImg ||
                      "https://via.placeholder.com/150"
                    }
                    alt={product.title}
                    className="w-48 h-48 sm:w-40 sm:h-40 rounded-md object-cover"
                  />
                  <div className="ml-4 flex flex-col justify-between">
                    <h2 className="text-sm sm:text-base font-medium text-gray-800">
                      {product.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Brand: {product.brand}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Sold:{" "}
                      <Badge className="px-2 py-1">
                        {product.totalSoldQuantity}
                      </Badge>
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">
                      Price: ${product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">
              No top-selling products available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
