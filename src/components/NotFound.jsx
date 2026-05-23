import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">

        <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">
          404 · Page not found
        </p>

        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          This page doesn't exist.
        </h1>

        <p className="text-gray-500 text-base leading-relaxed mb-10">
          The story you're looking for may have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="w-12 h-px bg-gray-300 mx-auto mb-10" />

        <button
          onClick={() => navigate("/")}
          className="text-sm font-medium text-white bg-black px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
        >
          Go back home
        </button>

        <p className="mt-6 text-xs text-gray-400">
          Or{" "}
          <span
            onClick={() => navigate(-1)}
            className="underline cursor-pointer hover:text-gray-600 transition-colors"
          >
            return to previous page
          </span>
        </p>
      </div>
    </div>
  );
}