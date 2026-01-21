import { Navigate } from "react-router-dom";

const AuthRoute = ({ user, children }) => {
  // ⛔ If logged in → redirect to shop
  if (user) {
    return <Navigate to="/shop" replace />;
  }

  return children;
};

export default AuthRoute;
