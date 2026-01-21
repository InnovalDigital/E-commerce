import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  console.log("Shop page rendered");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrices, setSelectedPrices] = useState([]);

  /* ======================
     FETCH PRODUCTS
  ====================== */
  useEffect(() => {
    fetch("http://localhost:3000/products", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH PRODUCTS ERROR:", err);
        setLoading(false);
      });
  }, []);

  /* ======================
     FILTER LOGIC (REAL DATA)
  ====================== */
  const filteredProducts = products.filter((product) => {
    // 🔍 Search
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    // 📂 Category
    const matchCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    // 💰 Price (after discount)
    const finalPrice =
      product.discount > 0
        ? product.price -
          Math.round((product.price * product.discount) / 100)
        : product.price;

    const matchPrice =
      selectedPrices.length === 0 ||
      selectedPrices.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return finalPrice >= min && finalPrice <= max;
      });

    return matchSearch && matchCategory && matchPrice;
  });

  /* ======================
     UI STATES
  ====================== */
  if (loading) {
    return <p className="text-center mt-20">Loading products...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar search={search} setSearch={setSearch} />

      <div className="flex">
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPrices={selectedPrices}
          setSelectedPrices={setSelectedPrices}
        />

        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-6">
            Products ({filteredProducts.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-gray-500 mt-10">
              No products found.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
