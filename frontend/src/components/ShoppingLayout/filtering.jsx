import React from "react";
import { filterOptions } from "@/config/config";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

function Filtering({ filteredProducts, setFilteredProducts, handlefiltered }) {
  const categories = filterOptions.slice(0, 5);
  const brands = filterOptions.slice(5);

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>

      {/* Filters Section */}
      <div className="p-4 space-y-6">
        {/* Category Filters */}
        <div>
          <h3 className="text-base font-bold">Category</h3>
          <div className="grid gap-2 mt-2">
            {categories.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 font-medium text-sm"
              >
                <Checkbox
                  onCheckedChange={() => handlefiltered(option.label, "category")}
                  checked={filteredProducts?.category?.includes(option.label)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brand Filters */}
        <div>
          <h3 className="text-base font-bold">Brand</h3>
          <div className="grid gap-2 mt-2">
            {brands.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 font-medium text-sm"
              >
                <Checkbox
                  onCheckedChange={() => handlefiltered(option.label, "brand")}
                  checked={filteredProducts?.brand?.includes(option.label)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filtering;
