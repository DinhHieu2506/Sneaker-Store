import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

import { useSearchParams } from "react-router-dom";

const FilterCheckbox = ({ id, label, checked, onChange }: any) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        id={id}
        onClick={() => onChange(!checked)}
        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center
          data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 111.414-1.414l3.543 3.543 7.543-7.543a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      <label
        htmlFor={id}
        onClick={() => onChange(!checked)}
        className="text-sm font-medium leading-none cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};

const ProductFilters = () => {
  const brands = [
    "Nike",
    "Adidas",
    "Jordan",
    "Puma",
    "New Balance",
    "Converse",
  ];
  const categories = [
    "Running",
    "Lifestyle",
    "Basketball",
    "Training",
    "Skateboarding",
  ];
  const genders = ["Men", "Women", "Unisex"];
  const sizes = [
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
  ];

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand"));
    setSelectedCategories(searchParams.getAll("category"));
    setSelectedGenders(searchParams.getAll("gender"));
    setSelectedSizes(searchParams.getAll("size"));
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 500;
    setPriceRange([minPrice, maxPrice]);
  }, [searchParams]);

  const toggleSelection = (
    value: string,
    list: string[],
    setList: (val: string[]) => void
  ) => {
    if (list.includes(value)) setList(list.filter((v) => v !== value));
    else setList([...list, value]);
  };

 const handleApply = () => {
  // clone params cũ để giữ lại các filter trước
  const params = new URLSearchParams(searchParams);

  // clear brand / category / gender / size trước khi append lại
  params.delete("brand");
  params.delete("category");
  params.delete("gender");
  params.delete("size");

  selectedBrands.forEach((b) => params.append("brand", b));
  selectedCategories.forEach((c) => params.append("category", c));
  selectedGenders.forEach((g) => params.append("gender", g));
  selectedSizes.forEach((s) => params.append("size", s));

  // luôn cập nhật giá mới nhất
  params.set("minPrice", String(priceRange[0]));
  params.set("maxPrice", String(priceRange[1]));

  setSearchParams(params);
};


  const handleClear = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
    setPriceRange([0, 500]);
    setSearchParams({});
  };

  return (
    <aside className="lg:w-64">
      <div className="space-y-6">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <div className="text-2xl font-semibold">Filters</div>
          </div>
          <div className="p-6 pt-0 space-y-6">
            {/* Brand */}
            <div>
              <h3 className="font-medium mb-3">Brand</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <FilterCheckbox
                    key={brand}
                    id={`brand-${brand}`}
                    label={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() =>
                      toggleSelection(brand, selectedBrands, setSelectedBrands)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="font-medium mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <FilterCheckbox
                    key={category}
                    id={`category-${category}`}
                    label={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() =>
                      toggleSelection(
                        category,
                        selectedCategories,
                        setSelectedCategories
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <h3 className="font-medium mb-3">Gender</h3>
              <div className="space-y-2">
                {genders.map((gender) => (
                  <FilterCheckbox
                    key={gender}
                    id={`gender-${gender}`}
                    label={gender}
                    checked={selectedGenders.includes(gender)}
                    onChange={() =>
                      toggleSelection(
                        gender,
                        selectedGenders,
                        setSelectedGenders
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="font-medium mb-3">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <FilterCheckbox
                    key={`size-${size}`}
                    id={`size-${size}`}
                    label={size}
                    checked={selectedSizes.includes(size)}
                    onChange={() =>
                      toggleSelection(size, selectedSizes, setSelectedSizes)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleApply}
                className="w-full bg-primary text-white rounded-md px-4 py-2 hover:bg-primary/90 cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClear}
                className="w-full border rounded-md px-4 py-2 hover:bg-accent cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default function SortProduct() {
  return <ProductFilters />;
}
