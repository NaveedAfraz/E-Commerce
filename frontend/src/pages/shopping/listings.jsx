import { useEffect, useState } from "react";
import Filtering from "@/components/ShoppingLayout/filtering";
import ProductDisplay from "@/components/ShoppingLayout/productDisplay";
import ProductDetailsModal from "@/components/ShoppingLayout/productDetails";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { fetchAllProducts, fetchProductDetails } from "@/store/shop-Slice/shop";
import { addProductToCart, fetchcartDetails } from "@/store/shop-Slice/cart";
import { sortOptions } from "@/config/config";

function Listings() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.userCart);
  console.log(cartItems);
  console.log(user);
  useEffect(() => {
    console.log("filteredProducts", filteredProducts);

    dispatch(
      fetchAllProducts({ filterParams: filteredProducts, sortParams: sortBy })
    ).then((res) => {
      console.log("fetvhing products");
      console.log(res);
    });
  }, [filteredProducts, sortBy]);

  useEffect(() => {
    const storedFilters = JSON.parse(sessionStorage.getItem("filters"));
    if (storedFilters) {
      setFilteredProducts(storedFilters);
    }
  }, []);

  useEffect(() => {
    if (productDetails.length > 0) {
      setOpenModal(true);
    }
  }, [productDetails]);

  const handleSortBy = (id) => {
    setSortBy(id);
  };

  const handlefiltered = (label, category) => {
    let cpyFilters = JSON.parse(sessionStorage.getItem("filters")) || {};

    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(category);
console.log(label,category);

    if (indexOfCurrentSection === -1) {
      cpyFilters = { ...cpyFilters, [category]: [label] };
    } else {
      const indexOfCurrentOption = cpyFilters[category].indexOf(label);
      if (indexOfCurrentOption === -1) {
        cpyFilters[category].push(label);
      } else {
        cpyFilters[category].splice(indexOfCurrentOption, 1);
      }
    }

    setFilteredProducts(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));

    const params = new URLSearchParams();
    Object.entries(cpyFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.append(key, values.join(","));
      }
    });
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  const handleDetails = async (ID) => {
    setSelectedProduct(ID);
    dispatch(fetchProductDetails(ID));
  };

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        <Filtering
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
          handlefiltered={handlefiltered}
        />
        <div className="bg-background w-full rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-extrabold">All Products</h2>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                {productList?.length} Products
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort by</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[200px] z-10 bg-white border rounded-sm shadow-lg my-2 cursor-pointer"
                >
                  <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={handleSortBy}
                    className="p-2"
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                        className="p-0.5 rounded-sm hover:bg-gray-100"
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {productList?.length > 0 ? (
              productList.map((productItem) => (
                <ProductDisplay
                  key={productItem.id}
                  product={productItem}
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
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
        </div>
      </div>
      {selectedProduct && (
        <ProductDetailsModal
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          productDetails={productDetails}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
}

export default Listings;
