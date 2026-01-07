import { useEffect, useState } from "react";
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

  return (
    <>
      {loading && <Loader />}
      {!loading && <AuthTabs />}
    </>
  );
}

export default App;
