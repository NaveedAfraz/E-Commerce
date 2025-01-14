import Filtering from "@/components/ShoppingLayout/filtering";
import ProductDetails from "@/components/ShoppingLayout/productDetails";
import ProductDisplay from "@/components/ShoppingLayout/productDisplay";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config/config";
import { fetchAllProducts } from "@/store/shop-Slice/shop";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Listings() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  console.log(productList);
  const [sortBy, setSortBy] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState();
  const [filteredProducts, setFilteredProducts] = useState({});
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, []);

  const handleSortBy = (id) => {
    console.log(id);
    setSortBy(id);
    // console.log(productList);

    // if (id === "price-lowtohigh") {
    //   setSortBy([...productList].sort((a, b) => a.price - b.price));
    // }
    // if (id === "price-hightolow") {
    //   setSortBy([...productList].sort((a, b) => b.price - a.price));
    //   console.log([...productList].sort((a, (b) => b.price - a.price)));
    // }
    console.log(sortBy);
  };

  const handlefiltered = (label, category) => {
    console.log(label, category);
    let cpyFilters = { ...filteredProducts };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(category);

    if (indexOfCurrentSection === -1) {
      console.log("running1");
      cpyFilters = {
        ...cpyFilters,
        [category]: [label],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[category].indexOf(label);
      console.log("running2");

      if (indexOfCurrentOption === -1) cpyFilters[category].push(label);
      else cpyFilters[category].splice(indexOfCurrentOption, 1);
    }
    console.log(cpyFilters);
    setFilteredProducts(cpyFilters);

    const params = new URLSearchParams();
    Object.entries(cpyFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.append(key, values.join(","));
      }
    });
    window.history.replaceState(null, "", `?${params.toString()}`);

    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  };

  useEffect(() => {
    setSortBy("price-lowtohigh");
    setFilteredProducts(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filteredProducts !== null && sortBy !== null)
      dispatch(
        fetchAllProducts({ filterParams: filteredProducts, sortParams: sortBy })
      ).then((res) => {
        console.log(res);
      });
  }, [filteredProducts, sortBy]);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const initialFilters = {};

  //   params.forEach((value, key) => {
  //     console.log(key, value);
  //     initialFilters[key] = value.split(","); // Convert comma-separated values to an array
  //   });

  //   setFilteredProducts(initialFilters);
  // console.log(filteredProducts);

  // }, [filteredProducts]);
  const handleDetails = (ID) => {
    setSelectedProduct(ID);
    dispatch(fetchDetails(ID));
    console.log(ID);
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
                  className="w-[200px] z-10 bg-white border rounded-sm shadow-lg my-2"
                >
                  <DropdownMenuRadioGroup
                    onValueChange={handleSortBy}
                    value={sortBy}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
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
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>
        <ProductDetails
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      </div>
    </>
  );
}

export default Listings;
