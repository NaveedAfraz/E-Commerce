import ProductDetailsModal from "@/components/ShoppingLayout/productDetails";
import ProductDisplay from "@/components/ShoppingLayout/productDisplay";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addProductToCart, fetchcartDetails } from "@/store/shop-Slice/cart";
import { resetSearchResults, SearchByKeyword } from "@/store/shop-Slice/search";
import { fetchProductDetails } from "@/store/shop-Slice/shop";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function Search() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // const [searchResults, setSearchResults] = useState([]);
  const { cartItems } = useSelector((state) => state.userCart);
  const { searchResults } = useSelector((state) => state.searchBar);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(SearchByKeyword(keyword)).then((res) => {
          console.log(res);
          if (res?.payload?.success) {
            // setSearchResults(res?.payload?.data);
          }
        });
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);
  console.log(searchResults);
  const handleDetails = (getCurrentProductId) => {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
    setOpenDetailsDialog(true);
  };
  console.log(productDetails);

  const handleAddtoCart = (productDetails) => {
    console.log(productDetails);
    // let quantity;
    // cartItems.map((item, index) => {
    //   if (item.productID === productDetails?.productID) {
    //     quantity = productDetails?.totalStock - item.quantity;
    //     console.log(quantity);
    let remainingStock = productDetails?.totalStock;
    const existingCartItem = cartItems.find(
      (item) => item.productID === productDetails?.productID
    );
    if (existingCartItem) {
      remainingStock = productDetails?.totalStock - existingCartItem.quantity;
      if (remainingStock <= 0) {
        toast({
          title: "Cannot add more than available stock",
          duration: 2000,
          className: "bg-red-500 text-white",
        });
        return;
      }
    }
    // console.log(quantity);

    if (remainingStock > 0) {
      dispatch(
        addProductToCart({
          productDetails: productDetails,
          userid: user.userid,
        })
      ).then((res) => {
        console.log(res);
        if (res?.payload?.sucess) {
          toast({ title: "Item added to cart successfully", duration: 2000 });
          dispatch(fetchcartDetails(user.userid)).then((res) => {
            console.log(res);
          });
        }
      });
    }
  };
  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {searchResults?.length > 0 ? (
          searchResults.map((productItem) => (
            <ProductDisplay
              key={productItem.id}
              product={productItem}
              // selectedProduct={selectedProduct}
              // setSelectedProduct={setSelectedProduct}
              handleDetails={handleDetails}
              handleAddtoCart={handleAddtoCart}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No products found
          </div>
        )}
      </div>
      <div />
      <ProductDetailsModal
        setOpenModal={setOpenDetailsDialog}
        openModal={openDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default Search;
