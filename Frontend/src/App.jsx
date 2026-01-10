import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthTabs from "./components/AuthTabs";
import Loader from "./components/Loader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 Show loader first
  if (loading) {
    return <Loader />;
  }

  // 🔥 After loader, render app routes
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth (Register / Login) */}
        <Route path="/" element={<AuthTabs />} />

        {/* Email verification success */}
        <Route path="/email-verified" element={<EmailVerified />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
