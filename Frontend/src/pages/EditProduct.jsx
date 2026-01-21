import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image as ImageIcon, Save, ArrowLeft } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ======================
     FETCH PRODUCT DATA
  ======================= */
  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError("Failed to load product");
          setLoading(false);
          return;
        }

        const p = data.product;

        setFormData({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          discount: p.discount || "",
          category: p.category || "",
        });

        if (p.image?.data?.data) {
          const base64 = btoa(
            p.image.data.data.reduce(
              (acc, byte) => acc + String.fromCharCode(byte),
              ""
            )
          );
          setExistingImage(`data:${p.image.contentType};base64,${base64}`);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH PRODUCT ERROR:", err);
        setError("Server error");
        setLoading(false);
      });
  }, [id]);

  /* ======================
     INPUT HANDLER
  ======================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ======================
     SUBMIT UPDATE
  ======================= */
  const handleUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discount", formData.discount);
      data.append("category", formData.category);

      if (image) {
        data.append("image", image);
      }

      const res = await fetch(
        `http://localhost:3000/products/update/${id}`,
        {
          method: "PUT",
          body: data,
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Update failed");
      }

      setSuccess("Product updated successfully ✅");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  

  /* ======================
     UI STATES
  ======================= */
  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-20">
        Loading product...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-20">
        {error}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition
            ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
        >
          <Save size={18} />
          {saving ? "Updating..." : "Update Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product title"
            className="w-full px-5 py-3 text-xl rounded-xl border
              focus:ring-2 focus:ring-[#C2B59B] focus:outline-none"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description..."
            className="w-full h-72 px-5 py-4 rounded-xl border text-sm
              focus:ring-2 focus:ring-[#C2B59B] focus:outline-none resize-none"
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* CATEGORY */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h3 className="font-medium mb-3">Category</h3>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border
                focus:ring-2 focus:ring-[#C2B59B] focus:outline-none"
            >
              <option value="">Select Category</option>
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
              <option>Footwear</option>
              <option>Accessories</option>
            </select>
          </div>

          {/* PRICING */}
          <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
            <h3 className="font-medium">Pricing</h3>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full h-11 px-4 rounded-xl border"
            />

            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount %"
              className="w-full h-11 px-4 rounded-xl border"
            />
          </div>

          {/* IMAGE */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h3 className="font-medium mb-3">Product Image</h3>

            <label className="block cursor-pointer">
              <div className="h-44 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    className="w-full h-full object-cover"
                  />
                ) : existingImage ? (
                  <img
                    src={existingImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="mx-auto mb-2" />
                    <p className="text-sm">Upload image</p>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>

          {success && (
            <p className="text-green-600 text-sm">{success}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default EditProduct;
