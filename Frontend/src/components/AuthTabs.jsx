import { useState } from "react";

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState("");


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  /* ======================
     INPUT HANDLER
  ====================== */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ======================
     REGISTER VALIDATION
  ====================== */
  const validateRegister = () => {
    let err = {};

    if (!formData.username || formData.username.length < 3) {
      err.username = "Username must be at least 3 characters";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      err.email = "Enter a valid email";
    }

    if (!formData.password || formData.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ======================
     LOGIN VALIDATION
  ====================== */
const validateLogin = () => {
  let err = {};

  if (!formData.email) {
    err.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    err.email = "Enter a valid email";
  }

  if (!formData.password) {
    err.password = "Password is required";
  }

  setErrors(err);
  return Object.keys(err).length === 0;
};


  /* ======================
     REGISTER SUBMIT
  ====================== */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setLoading(true);
    setErrors({});

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (profilePic) data.append("profilepic", profilePic);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrors({ form: result.message || "Registration failed" });
        setLoading(false);
        return;
      }

      setSuccessMessage(
        "Verification link has been sent to your email 📧"
      );
    } catch (err) {
      setErrors({ form: "Server error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     LOGIN SUBMIT
  ====================== */
  const handleLogin = async (e) => {
  e.preventDefault();

  setErrors({});
  setLoginSuccess("");
  setLoading(true);

  // 🔥 THIS WAS MISSING
  if (!validateLogin()) {
    setLoading(false);
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      setErrors({ form: result.message });
      setLoading(false);
      return;
    }

    setLoginSuccess("Login successful 🎉");

  } catch (err) {
    setErrors({ form: "Server error. Try again." });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* BRAND */}
        <h1 className="text-center text-2xl mb-6 font-serif">
          Farid<span className="text-[#C2B59B]">'s</span>Store
        </h1>

        {/* TABS */}
        <div className="relative mb-6 border-b flex overflow-hidden">
          <button
            type="button"
            className={`w-1/2 py-3 text-sm ${activeTab === "register" ? "text-black" : "text-gray-400"
              }`}
            onClick={() => {
              setActiveTab("register");
              setErrors({});
            }}
          >
            Register
          </button>

          <button
            type="button"
            className={`w-1/2 py-3 text-sm ${activeTab === "login" ? "text-black" : "text-gray-400"
              }`}
            onClick={() => {
              setActiveTab("login");
              setErrors({});
            }}
          >
            Login
          </button>

          <span
            className={`absolute bottom-0 left-0 h-[2px] w-1/2 bg-[#C2B59B]
            transition-transform duration-300
            ${activeTab === "login" ? "translate-x-full" : "translate-x-0"}`}
          />
        </div>

        {/* ================= REGISTER ================= */}
        {activeTab === "register" && (
          <form
            onSubmit={handleRegister}
            encType="multipart/form-data"
            className="space-y-4"
          >
            {/* Profile Pic */}
            <div className="flex justify-center">
              <label className="cursor-pointer">
                <div className="w-24 h-24 rounded-full border border-dashed flex items-center justify-center overflow-hidden">
                  {profilePic ? (
                    <img
                      src={URL.createObjectURL(profilePic)}
                      className="w-full h-full object-cover"
                      alt="profile"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Upload</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
              </label>
            </div>

            <input
              name="username"
              placeholder="Username"
              className="w-full border p-3 rounded"
              onChange={handleChange}
              disabled={successMessage}
            />
            {errors.username && (
              <p className="text-red-500 text-xs">{errors.username}</p>
            )}

            <input
              name="email"
              placeholder="Email"
              className="w-full border p-3 rounded"
              onChange={handleChange}
              disabled={successMessage}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                disabled={successMessage}
                className="
      w-full
      h-12
      px-4
      pr-12
      border border-gray-300
      rounded-lg
      text-sm
      focus:outline-none
      focus:ring-2
      focus:ring-[#C2B59B]
      focus:border-[#C2B59B]
      transition
    "
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="
      absolute
      right-4
      top-8
      -translate-y-1/2
      cursor-pointer
      text-gray-400
      hover:text-black
      transition
    "
              >
                {showPassword ? (
                  // Eye Off (modern)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.8 21.8 0 015.06-5.94" />
                    <path d="M1 1l22 22" />
                    <path d="M9.9 4.24A10.94 10.94 0 0112 5c7 0 11 7 11 7a21.8 21.8 0 01-4.17 5.06" />
                  </svg>
                ) : (
                  // Eye (modern)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}

            {/* SUCCESS MESSAGE */}
            {successMessage && (
              <div className="flex items-start gap-3 bg-[#fdfaf5] border border-[#C2B59B] px-4 py-3 rounded-xl text-sm">
                <div className="text-[#C2B59B] text-lg">✔</div>
                <div>
                  <p className="font-medium">Verification email sent</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                </div>
              </div>
            )}

            {errors.form && (
              <p className="text-red-500 text-sm text-center">
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || successMessage}
              className={`w-full py-3 rounded text-white transition
                ${loading || successMessage
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
                }`}
            >
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>
        )}

        {/* ================= LOGIN ================= */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              name="email"
              placeholder="Email"
              className="w-full border p-3 rounded"
              onChange={handleChange}
            />
              {errors.email && (
  <p className="text-red-500 text-xs">{errors.email}</p>
)}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="
      w-full
      h-12
      px-4
      pr-12
      border border-gray-300
      rounded-lg
      text-sm
      focus:outline-none
      focus:ring-2
      focus:ring-[#C2B59B]
      focus:border-[#C2B59B]
      transition
    "
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="
      absolute
      right-4
      top-8
      -translate-y-1/2
      cursor-pointer
      text-gray-400
      hover:text-black
      transition
    "
              >
                {showPassword ? (
                  // Eye Off (modern)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.8 21.8 0 015.06-5.94" />
                    <path d="M1 1l22 22" />
                    <path d="M9.9 4.24A10.94 10.94 0 0112 5c7 0 11 7 11 7a21.8 21.8 0 01-4.17 5.06" />
                  </svg>
                ) : (
                  // Eye (modern)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>
            {errors.password && (
  <p className="text-red-500 text-xs">{errors.password}</p>
)}

            {loginSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center">
                {loginSuccess}
              </div>
            )}
            
            {errors.form && (
              <p className="text-red-500 text-sm text-center">
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || loginSuccess}
              className={`w-full py-3 rounded text-white transition
                ${loading || loginSuccess
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
                }`}
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthTabs;
