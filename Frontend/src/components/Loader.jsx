const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        
        {/* Logo */}
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
          FS
        </div>

        {/* Brand Name */}
        <h1
          className="text-xl tracking-wide"
          style={{ fontFamily: "Playfair Display" }}
        >
          Farid<span className="text-[#C2B59B]">'s</span>Store
        </h1>

        <p className="text-xs text-gray-400">
          Loading premium experience…
        </p>
      </div>
    </div>
  );
};

export default Loader;
