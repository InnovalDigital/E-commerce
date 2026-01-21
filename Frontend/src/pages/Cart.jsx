import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH CART ================= */
  useEffect(() => {
    fetch("http://localhost:3000/users/cart", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("CART API RESPONSE:", data);

        if (data.success) {
          setCart(data.cart); // ✅ VERY IMPORTANT
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH CART ERROR:", err);
        setLoading(false);
      });
  }, []);

  const handleRemove = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/users/cart/remove/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      // 🔥 update UI instantly
      setCart(prev =>
        prev.filter(item => item.productId._id !== productId)
      );

    } catch (err) {
      alert("Failed to remove item");
    }
  };


  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const res = await fetch("http://localhost:3000/users/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (!data.success) throw new Error();

      setCart(prev =>
        prev.map(item =>
          item.productId._id === productId
            ? { ...item, quantity }
            : item
        )
      );
    } catch {
      alert("Failed to update quantity");
    }
  };


  /* ================= UI STATES ================= */
  if (loading) {
    return <p className="text-center mt-20">Loading cart...</p>;
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20">
          <h2 className="text-2xl font-semibold">Your Cart (0)</h2>
          <p className="text-gray-500 mt-2">Your cart is empty.</p>
        </div>
      </>
    );
  }

  /* ================= TOTAL ================= */
  const total = cart.reduce((sum, item) => {
    const product = item.productId;

    const finalPrice =
      product.discount > 0
        ? product.price -
        Math.round((product.price * product.discount) / 100)
        : product.price;

    return sum + finalPrice * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Your Cart ({cart.length})
        </h2>

        {/* CART ITEMS */}
        <div className="space-y-4">
          {cart.map((item) => {
            const product = item.productId;

            const finalPrice =
              product.discount > 0
                ? product.price -
                Math.round((product.price * product.discount) / 100)
                : product.price;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
              >
                {/* IMAGE */}
                <img
                  src={
                    product.image?.data
                      ? `data:${product.image.contentType};base64,${btoa(
                        String.fromCharCode(...product.image.data.data)
                      )}`
                      : "https://via.placeholder.com/120"
                  }
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* INFO */}
                <div className="flex-1">
                  <p className="text-xs uppercase text-gray-400">
                    {product.category}
                  </p>
                  <h3 className="font-semibold">{product.name}</h3>

                  <p className="text-sm mt-1">
                    ₹{finalPrice} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(product._id, item.quantity - 1)
                    }
                    className="px-3 py-1 border rounded"
                  >
                    −
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(product._id, item.quantity + 1)
                    }
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                </div>

                {/* REMOVE (frontend only for now) */}
                <button
                  onClick={() => handleRemove(product._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>

              </div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div className="bg-white mt-8 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white py-3 rounded-lg mt-4"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
