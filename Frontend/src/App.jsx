import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthTabs from "./components/AuthTabs";
import Loader from "./components/Loader";
import EmailVerified from "./EmailVerified";
import Shop from "./pages/Shop";
import AdminDashboard from "./pages/AdminDashboard";
import EditProduct from "./pages/EditProduct";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    fetch("http://localhost:3000/users/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 Show loader first
  if (loading) {
    return <Loader />;
  }

  // 🔥 After loader, render app routes
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth (Register / Login) */}
        <Route path="/" element={<AuthTabs />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<div>Wishlist Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* other routes */}
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout/:id" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
