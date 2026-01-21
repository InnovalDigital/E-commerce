import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // ✅ calculate final price safely
  const finalPrice =
    product.discount > 0
      ? product.price -
        Math.round((product.price * product.discount) / 100)
      : product.price;

  const hasDiscount = product.discount > 0;

  // ✅ SAFE image renderer (NO CRASH)
  const imageSrc = product.image?.data
    ? `data:${product.image.contentType};base64,${btoa(
        new Uint8Array(product.image.data.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`
    : "https://via.placeholder.com/300";

  // ✅ Add to cart
  const handleAddToCart = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/cart/add/${product._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
      // 🔥 NOT LOGGED IN
      if (res.status === 401) {
        navigate("/", {
          state: {
            message: "Please login to add items to cart",
            redirectTo: `/product/${product._id}`,
          },
        });
        return;
      }

      throw new Error(data.message || "Failed to add to cart");
    }

      alert("Product added to cart 🛒");
    } catch (error) {
      console.error("ADD TO CART ERROR:", error.message);
      alert("Please login to add items to cart");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
      <Link to={`/product/${product._id}`}>
        {/* IMAGE */}
        <div className="relative mb-4">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />

          {/* DISCOUNT TAG */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* CATEGORY */}
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
          {product.category}
        </p>

        {/* NAME */}
        <h3 className="font-semibold text-sm mb-2">{product.name}</h3>

        {/* PRICE */}
        <div className="mb-4">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">₹{finalPrice}</span>
              <span className="text-sm line-through text-gray-400">
                ₹{product.price}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold">₹{product.price}</span>
          )}
        </div>
      </Link>

      {/* ACTIONS */}
      <div className="mt-auto flex gap-2">
        <button
          onClick={() => navigate(`/checkout/${product._id}`)}
          className="flex-1 bg-black text-white py-2 rounded-md text-sm"
        >
          Buy Now
        </button>

        <button
          onClick={handleAddToCart}
          className="flex-1 border rounded-lg py-2 hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
