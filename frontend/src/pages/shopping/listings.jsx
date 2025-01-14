import Filtering from "@/components/ShoppingLayout/filtering";
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
  const [filteredProducts, setFilteredProducts] = useState({});
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, []);
  const handleSortBy = (id) => {
    console.log(id);
    setSortBy(id);
    if (id === "price-lowtohigh") {
      setSortBy([...productList].sort((a, b) => a.price - b.price));
    }
    if (id === "price-hightolow") {
      setSortBy([...productList].sort((a, b) => b.price - a.price));
    }
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
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
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
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ProductDisplay
                    // handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    //handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>{" "}
      </div>
    </>
  );
}

export default Listings;
