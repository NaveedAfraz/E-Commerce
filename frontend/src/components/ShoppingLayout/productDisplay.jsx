import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductDisplay({
  product,
  setSelectedProduct,
  handleDetails,
  handleAddtoCart,
  show,
  setShow,
  text,
}) {
  // console.log(outofStock);
  //  console.log(text);
  const location = useLocation();
  // console.log(location);
  const navigate = useNavigate();
  // const handleHomeDetails = (product) => {
  //   console.log(product);

  //   const path = "/shopping/Listings";
  //   const query = `?category=${product?.cat}`;

  //   const fullUrl = `${path}${query}`;

  //   // Retrieve the current array from session storage
  //   const currentCategories =
  //     JSON.parse(sessionStorage.getItem("categories")) || [];
  //   console.log(currentCategories);
  //   setShow(true);
  //   // Append the new category if it doesn't already exist
  //   if (!currentCategories.includes(product?.cat)) {
  //     currentCategories.push(product?.cat);
  //   }
  //   const currentCategoriesCap = currentCategories.map(
  //     (category) => category.charAt(0).toUpperCase() + category.slice(1)
  //   );
  //   console.log(currentCategoriesCap);

  //   // Save the updated array back to session storage
  //   sessionStorage.setItem(
  //     "filters",
  //     JSON.stringify({ category: currentCategoriesCap })
  //   );
  //   console.log(show);

  //   // Navigate to the constructed URL
  //   navigate(fullUrl);
  // };

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-2xl transition-shadow ">
      <div onClick={() => handleDetails(product?.productID)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          {!show && (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[16px] text-muted-foreground">
                  {product?.cat.charAt(0).toUpperCase() + product?.cat.slice(1)}
                </span>
                <span className="text-[16px] text-muted-foreground">
                  {product?.brand.charAt(0).toUpperCase() +
                    product?.brand.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`${
                    product?.salePrice > 0 ? "line-through" : ""
                  } text-lg font-semibold text-primary`}
                >
                  ${product?.price}
                </span>
                {product?.salePrice > 0 ? (
                  <span className="text-lg font-semibold text-primary">
                    ${product?.salePrice}
                  </span>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </div>

      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : !show ? (
          <Button onClick={() => handleAddtoCart(product)} className="w-full">
            Add to cart
          </Button>
        ) : (
          <Button className="w-full" onClick={() => handleDetails(product?.productID)}>
            {text}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
