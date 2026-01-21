const categories = ["Men", "Women", "Shoes", "Accessories"];

const priceRanges = [
  { label: "Under ₹500", value: "0-500" },
  { label: "₹500 – ₹1000", value: "500-1000" },
  { label: "₹1000 – ₹2000", value: "1000-2000" },
];

const Sidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedPrices,
  setSelectedPrices,
}) => {
  const handlePriceChange = (value) => {
    setSelectedPrices((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  return (
    <aside className="w-64 bg-white border-r p-5 hidden md:block">
      
      {/* CATEGORY */}
      <h3 className="font-semibold mb-3">Categories</h3>
      <ul className="space-y-2 text-sm mb-6">
        <li
          className={`cursor-pointer ${
            selectedCategory === "All" ? "text-black font-medium" : "text-gray-600"
          }`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </li>
        {categories.map((cat) => (
          <li
            key={cat}
            className={`cursor-pointer ${
              selectedCategory === cat
                ? "text-black font-medium"
                : "text-gray-600"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>

      {/* PRICE FILTER */}
      <h3 className="font-semibold mb-3">Price</h3>
      <div className="space-y-2 text-sm">
        {priceRanges.map((range) => (
          <label key={range.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPrices.includes(range.value)}
              onChange={() => handlePriceChange(range.value)}
            />
            {range.label}
          </label>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
