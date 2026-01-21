import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const Checkout = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [payment, setPayment] = useState("cod");

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-center mt-20">Loading checkout...</p>;
  }

  const discountAmount =
    product.discount > 0
      ? Math.round((product.price * product.discount) / 100)
      : 0;

  const finalAmount = product.price - discountAmount;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT – ADDRESS & PAYMENT */}
        <div className="lg:col-span-2 space-y-10">

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-xl font-semibold mb-6">
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(address).map((field) => (
                <input
                  key={field}
                  placeholder={field.toUpperCase()}
                  value={address[field]}
                  onChange={(e) =>
                    setAddress({ ...address, [field]: e.target.value })
                  }
                  className="h-12 px-4 border rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                />
              ))}
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-xl font-semibold mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={payment === "online"}
                  onChange={() => setPayment("online")}
                />
                <span>Online Payment (UPI / Card)</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT – ORDER SUMMARY */}
        <div className="bg-white rounded-2xl shadow p-8 h-fit">

          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>

          {/* PRODUCT */}
          <div className="flex gap-4 mb-6">
            <img
              src={
                product.image?.data
                  ? `data:${product.image.contentType};base64,${btoa(
                      String.fromCharCode(...product.image.data.data)
                    )}`
                  : "https://via.placeholder.com/120"
              }
              alt={product.name}
              className="w-24 h-24 object-cover rounded-xl"
            />

            <div className="flex-1">
              <p className="text-xs uppercase text-gray-400">
                {product.category}
              </p>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm font-semibold mt-1">
                ₹{finalAmount}
              </p>
            </div>
          </div>

          {/* PRICE BREAKDOWN */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>MRP</span>
              <span>₹{product.price}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discountAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>

            <hr />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>

          {/* PLACE ORDER */}
          <button
            className="w-full mt-8 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition"
            onClick={() => alert("Order placed (frontend only)")}
          >
            Place Order
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Secure payments • Easy returns
          </p>
        </div>
      </div>
    </>
  );
};

export default Checkout;
