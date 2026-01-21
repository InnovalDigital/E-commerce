import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) throw new Error("Product not found");

                setProduct(data.product);

                // Fetch similar products by category
                return fetch(
                    `http://localhost:3000/products?category=${data.product.category}`
                );
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setSimilar(data.products.filter((p) => p._id !== id));
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Something went wrong");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <p className="text-center mt-20">Loading product...</p>;
    }

    if (error) {
        return <p className="text-center mt-20 text-red-500">{error}</p>;
    }

    return (
        <>
            <Navbar />

            {/* ================= MAIN PRODUCT ================= */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-14">

                {/* IMAGE */}
                <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <img
                        src={
                            product.image?.data
                                ? `data:${product.image.contentType};base64,${btoa(
                                    String.fromCharCode(...product.image.data.data)
                                )}`
                                : "https://via.placeholder.com/600"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* DETAILS */}
                <div className="space-y-6">
                    <p className="text-xs tracking-widest uppercase text-gray-400">
                        {product.category}
                    </p>

                    <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                        {product.name}
                    </h1>

                    {/* PRICE */}
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold">
                            ₹{product.finalPrice}
                        </span>

                        {product.discount > 0 && (
                            <>
                                <span className="text-lg text-gray-400 line-through">
                                    ₹{product.price}
                                </span>
                                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                    {product.discount}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {product.description}
                    </p>

                    {/* ACTIONS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => navigate(`/checkout/${product._id}`)}
                            className="bg-black text-white py-4 rounded-xl text-sm hover:bg-gray-900 transition"
                        >
                            Buy Now
                        </button>
                        <button className="border border-gray-300 py-4 rounded-xl text-sm hover:bg-gray-100 transition">
                            Add to Cart
                        </button>
                    </div>

                    {/* TRUST BADGES */}
                    <div className="flex gap-6 pt-6 text-xs text-gray-500">
                        <span>✔ 100% Original</span>
                        <span>✔ Secure Payments</span>
                        <span>✔ Easy Returns</span>
                    </div>
                </div>
            </div>

            {/* ================= SIMILAR PRODUCTS ================= */}
            {similar.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 pb-16">
                    <h2 className="text-2xl font-semibold mb-8">
                        Similar Products
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {similar.map((p) => (
                            <Link
                                key={p._id}
                                to={`/product/${p._id}`}
                                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
                            >
                                <div className="aspect-[4/3] bg-gray-100">
                                    <img
                                        src={
                                            p.image?.data
                                                ? `data:${p.image.contentType};base64,${btoa(
                                                    String.fromCharCode(...p.image.data.data)
                                                )}`
                                                : "https://via.placeholder.com/300"
                                        }
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-4 space-y-1">
                                    <p className="text-xs uppercase text-gray-400">
                                        {p.category}
                                    </p>
                                    <p className="font-medium truncate">{p.name}</p>
                                    <p className="text-sm font-semibold">
                                        ₹{p.finalPrice}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductPage;
