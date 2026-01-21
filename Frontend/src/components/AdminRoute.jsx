import { Navigate } from "react-router-dom";

const AdminRoute = ({ user, children }) => {
  // ⛔ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ⛔ Logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/shop" replace />;
  }

  return children;
};

export default AdminRoute;
