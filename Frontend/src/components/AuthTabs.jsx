import { useState } from "react";

const AuthTabs = () => {
    const [activeTab, setActiveTab] = useState("register");

    return (
        <div
            className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-gray-100
  flex flex-col animate-pageIn"
        >


            {/* ===== TOP BRAND HEADER ===== */}
            <header className="w-full py-6 flex justify-center">
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                        FS
                    </div>

                    {/* Brand Name */}
                    <div>
                        <h1
                            className="text-xl tracking-wide"
                            style={{ fontFamily: "Playfair Display" }}
                        >
                            Farid<span className="text-[#C2B59B]">'s</span>Store
                        </h1>
                        <p className="text-xs text-gray-500">
                            Premium Fashion Experience
                        </p>
                    </div>
                </div>
            </header>

            {/* ===== CENTER AUTH SECTION ===== */}
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative">

                    {/* Tabs */}
                    <div className="relative mb-8 border-b overflow-hidden">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab("register")}
                                className={`w-1/2 py-3 text-sm font-semibold transition-colors duration-300 ${activeTab === "register"
                                        ? "text-black"
                                        : "text-gray-400"
                                    }`}
                            >
                                Register
                            </button>

                            <button
                                onClick={() => setActiveTab("login")}
                                className={`w-1/2 py-3 text-sm font-semibold transition-colors duration-300 ${activeTab === "login"
                                        ? "text-black"
                                        : "text-gray-400"
                                    }`}
                            >
                                Login
                            </button>
                        </div>

                        {/* Animated underline */}
                        <span
                            className={`absolute bottom-0 left-0 h-[2px] w-1/2 bg-[#C2B59B]
              transition-transform duration-300 ease-in-out
              ${activeTab === "login" ? "translate-x-full" : "translate-x-0"}
              `}
                        />
                    </div>

                    {/* ===== FORMS ===== */}
                    <div className="relative">

                        {/* REGISTER */}
                        <div
                            className={`transition-all duration-300 ease-in-out ${activeTab === "register"
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                                }`}
                        >
                            <form className="space-y-4">

                                {/* Profile Pic */}
                                <div className="flex flex-col items-center">
                                    <label className="cursor-pointer">
                                        <div className="w-24 h-24 rounded-full border border-dashed flex items-center justify-center text-gray-400 hover:border-[#C2B59B] transition">
                                            Upload
                                        </div>
                                        <input type="file" className="hidden" />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Profile Picture
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Username
                                    </label>
                                    <input
                                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#C2B59B]"
                                        placeholder="Enter username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Email
                                    </label>
                                    <input
                                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#C2B59B]"
                                        placeholder="Enter email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#C2B59B]"
                                        placeholder="Create password"
                                    />
                                </div>

                                <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-[#C2B59B] hover:text-black transition">
                                    Create Account
                                </button>
                            </form>
                        </div>

                        {/* LOGIN */}
                        <div
                            className={`transition-all duration-300 ease-in-out ${activeTab === "login"
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                                }`}
                        >
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Username
                                    </label>
                                    <input
                                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#C2B59B]"
                                        placeholder="Enter username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Email
                                    </label>
                                    <input
                                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#C2B59B]"
                                        placeholder="Enter email"
                                    />
                                </div>

                                <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-[#C2B59B] hover:text-black transition">
                                    Login
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="text-center text-xs text-gray-400 pb-4">
                © {new Date().getFullYear()} Farid’sStore. All rights reserved.
            </footer>
        </div>
    );
};

export default AuthTabs;
