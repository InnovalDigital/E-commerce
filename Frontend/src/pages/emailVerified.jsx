const EmailVerified = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        <div className="text-5xl mb-4">🎉🎉</div>

        <h1 className="text-2xl font-serif mb-3">
          Email Verified Successfully
        </h1>

        <p className="text-gray-600 text-sm mb-6">
          Your email has been verified. You can now log in to your account.
        </p>

        <a
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-900 transition"
        >
          Go to Login
        </a>

      </div>
    </div>
  );
};

export default EmailVerified;
