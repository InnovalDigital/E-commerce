import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉🎉</div>
        <h1 className="text-2xl font-serif mb-3">
          Email Verified Successfully
        </h1>
        <p className="text-gray-600 text-sm">
          Redirecting to login…
        </p>
      </div>
    </div>
  );
};

export default EmailVerified;
