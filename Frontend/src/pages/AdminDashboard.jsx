import { useState, useEffect } from "react";
import {
    PlusCircle,
    Package,
    Users,
    Trash2,
    Edit3,
    Image as ImageIcon,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {


    const [activeTab, setActiveTab] = useState("create");

    return (
        <div className="min-h-screen bg-[#f5f5f5] px-6 py-10">
            {/* HEADER */}
            <h1 className="text-3xl font-serif text-center mb-10">
                Admin<span className="text-[#C2B59B]"> Dashboard</span>
            </h1>

            {/* TOGGLE TABS */}
            <div className="flex justify-center mb-12">
                <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
                    <TabButton
                        active={activeTab === "create"}
                        icon={<PlusCircle size={18} />}
                        label="Create Product"
                        onClick={() => setActiveTab("create")}
                    />
                    <TabButton
                        active={activeTab === "products"}
                        icon={<Package size={18} />}
                        label="All Products"
                        onClick={() => setActiveTab("products")}
                    />
                    <TabButton
                        active={activeTab === "users"}
                        icon={<Users size={18} />}
                        label="All Users"
                        onClick={() => setActiveTab("users")}
                    />
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-6xl mx-auto">
                {activeTab === "create" && <CreateProduct />}
                {activeTab === "products" && <AllProducts />}
                {activeTab === "users" && <AllUsers />}
            </div>
        </div>
    );
};

export default AdminDashboard;

/* ================= TAB BUTTON ================= */

const TabButton = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-all
      ${active
                ? "bg-black text-white shadow-md"
                : "bg-white text-gray-500 hover:bg-gray-100"}
    `}
    >
        {icon}
        {label}
    </button>
);

/* ================= CREATE PRODUCT ================= */

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        discount: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    /* =====================
       INPUT CHANGE HANDLER
    ====================== */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /* =====================
       SUBMIT HANDLER
    ====================== */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append("discount", formData.discount);
            data.append("description", formData.description);
            if (image) data.append("image", image);

            const res = await fetch("http://localhost:3000/products/create", {
                method: "POST",
                body: data,
                credentials: "include",
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || "Failed to create product");
            }

            setSuccess("Product created successfully ✅");

            // reset form
            setFormData({
                name: "",
                category: "",
                price: "",
                discount: "",
                description: "",
            });
            setImage(null);

        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-2xl p-10 max-w-3xl mx-auto"
            encType="multipart/form-data"
        >
            <h2 className="text-2xl font-semibold mb-8">
                Create New Product
            </h2>

            {/* IMAGE UPLOAD */}
            <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                    Product Image
                </label>

                <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50 transition">
                    {image ? (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="preview"
                            className="h-full w-full object-cover rounded-2xl"
                        />
                    ) : (
                        <>
                            <ImageIcon className="text-gray-400 mb-3" size={32} />
                            <span className="text-sm text-gray-400">
                                Click to upload image
                            </span>
                        </>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </label>
            </div>

            {/* INPUTS */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <Input
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                    <option>Footwear</option>
                    <option>Accessories</option>
                </Select>

                <Input
                    name="price"
                    placeholder="Price (₹)"
                    value={formData.price}
                    onChange={handleChange}
                />

                <Input
                    name="discount"
                    placeholder="Discount (%)"
                    value={formData.discount}
                    onChange={handleChange}
                />
            </div>

            {/* DESCRIPTION */}
            <textarea
                name="description"
                placeholder="Product description..."
                value={formData.description}
                onChange={handleChange}
                className="
          w-full h-48 px-5 py-4 border rounded-2xl text-sm shadow-sm
          focus:ring-2 focus:ring-[#C2B59B] focus:outline-none resize-none
        "
            />

            {/* MESSAGES */}
            {error && (
                <p className="text-red-500 text-sm mt-4">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-sm mt-4">{success}</p>
            )}

            {/* SUBMIT */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full mt-8 py-4 rounded-2xl text-white transition
          ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-900"}
        `}
            >
                {loading ? "Creating..." : "Create Product"}
            </button>
        </form>
    );
};


/* =====================
   HELPER INPUTS
====================== */
const Input = ({ name, placeholder, value, onChange }) => (
    <input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
      w-full h-12 px-4 border rounded-xl text-sm shadow-sm
      focus:ring-2 focus:ring-[#C2B59B] focus:outline-none
    "
    />
);

const Select = ({ name, value, onChange, children }) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        className="
      w-full h-12 px-4 border rounded-xl text-sm shadow-sm bg-white
      focus:ring-2 focus:ring-[#C2B59B] focus:outline-none
    "
    >
        {children}
    </select>
);

/* ================= ALL PRODUCTS ================= */

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("all");
    const [error, setError] = useState("");

    /* ======================
       FETCH PRODUCTS
    ======================= */
    useEffect(() => {
        fetch("http://localhost:3000/products", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProducts(data.products || []);
                } else {
                    setError(data.message || "Failed to load products");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("FETCH ERROR:", err);
                setError("Fetch failed");
                setLoading(false);
            });
    }, []); 

    const categories = [
        "all",
        "Men",
        "Women",
        "Kids",
        "Footwear",
        "Accessories",
    ];
    const navigate = useNavigate();

    const filteredProducts =
        category === "all"
            ? products
            : products.filter((p) => p.category === category);

    /* ======================
       DELETE PRODUCT
    ======================= */

    const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://localhost:3000/products/delete/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Delete failed");
    }

    // ✅ Redirect after delete
    navigate("/admin/dashboard", { replace: true });

  } catch (err) {
    alert(err.message || "Server error while deleting product");
  }
};




    /* ======================
       UI STATES
    ======================= */
    if (loading) {
        return <p className="text-center text-gray-500">Loading products...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }


    return (
        <div className="space-y-8">
            {/* HEADER + FILTER */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">All Products</h2>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 px-4 rounded-xl border shadow-sm
                     focus:ring-2 focus:ring-[#C2B59B] focus:outline-none"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat === "all" ? "All Categories" : cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                    <div
                        key={p._id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
                    >
                        {/* IMAGE */}
                        <div className="h-48 bg-gray-100">
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

                        {/* CONTENT */}
                        <div className="p-5 space-y-2">
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                                {p.category}
                            </p>

                            <h3 className="text-lg font-medium">{p.name}</h3>

                            <p className="text-sm text-gray-600">
                                ₹ {p.price}
                                {p.discount > 0 && (
                                    <span className="ml-2 text-green-600 text-xs">
                                        ({p.discount}% OFF)
                                    </span>
                                )}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    title="Edit"
                                    onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                >
                                    <Edit3 size={18} />
                                </button>


                                <button
                                    title="Delete"
                                    onClick={() => handleDelete(p._id)}
                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                >
                                    <Trash2 size={18} />
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* EMPTY STATE */}
            {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                    No products found in this category.
                </p>
            )}
        </div>
    );
};

/* ================= ALL USERS ================= */

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ======================
       FETCH USERS
    ======================= */
    useEffect(() => {
        fetch("http://localhost:3000/users", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUsers(data.users || []);
                } else {
                    setError(data.message || "Failed to load users");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("USERS FETCH ERROR:", err);
                setError("Fetch failed");
                setLoading(false);
            });
    }, []);

    const filteredUsers =
        roleFilter === "all"
            ? users
            : users.filter((u) =>
                roleFilter === "Admin" ? u.isAdmin : !u.isAdmin
            );

    /* ======================
       UI STATES
    ======================= */
    if (loading) {
        return <p className="text-center text-gray-500">Loading users...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="space-y-8">
            {/* HEADER + FILTER */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">All Users</h2>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="h-11 px-4 rounded-xl border shadow-sm
                     focus:ring-2 focus:ring-[#C2B59B] focus:outline-none"
                >
                    <option value="all">All Users</option>
                    <option value="Admin">Admins</option>
                    <option value="User">Users</option>
                </select>
            </div>

            {/* USERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((u) => (
                    <div
                        key={u._id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 flex items-center gap-4"
                    >

                        {/* AVATAR */}
                        <img
                            src={
                                u.profilepic?.data?.data
                                    ? `data:${u.profilepic.contentType};base64,${btoa(
                                        u.profilepic.data.data.reduce(
                                            (data, byte) => data + String.fromCharCode(byte),
                                            ""
                                        )
                                    )}`
                                    : "https://via.placeholder.com/300"
                            }
                            alt={u.username}
                            className="w-16 h-16 rounded-full object-cover border"
                        />



                        {/* USER INFO */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-lg truncate">
                                {u.username}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {u.email}
                            </p>

                            {/* ROLE BADGE */}
                            <span
                                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium
                  ${u.isAdmin
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {u.isAdmin ? "Admin" : "User"}
                            </span>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col gap-3">
                            <a href={`/users/edit/${u._id}`} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                                <Edit3 size={18} />
                            </a >

                            <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* EMPTY STATE */}
            {filteredUsers.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                    No users found for this role.
                </p>
            )}
        </div>
    );
};

