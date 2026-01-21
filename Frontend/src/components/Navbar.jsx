import { NavLink } from "react-router-dom";
import { Heart, ShoppingCart, User, Search } from "lucide-react";

const Navbar = ({ search, setSearch }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm transition
     ${isActive ? "text-[#C2B59B]" : "text-gray-600 hover:text-black"}`;

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between gap-6">

      {/* LOGO */}
      <NavLink to="/shop" className="text-xl font-serif whitespace-nowrap">
        Farid<span className="text-[#C2B59B]">'s</span>Store
      </NavLink>

      {/* SEARCH */}
      <div className="flex-1 max-w-md relative">
        <Search
          size={18}
          className="absolute left-3 top-7 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2B59B] focus:outline-none"
        />
      </div>

      {/* ICONS */}
      <div className="flex items-center gap-6">
        <NavLink to="/wishlist" className={linkClass}>
          <Heart size={20} />
        </NavLink>
        <NavLink to="/cart" className={linkClass}>
          <ShoppingCart size={20} />
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <User size={20} />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
