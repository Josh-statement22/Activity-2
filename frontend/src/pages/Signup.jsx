import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { NotebookPen } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await api.post("/auth/signup", { email, password });

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to signup. Try again later."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-yellow-100 via-white to-gray-100 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-yellow-300 blur-[120px] opacity-30"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-yellow-400 blur-[120px] opacity-30"></div>

      {/* Signup Card */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 p-10 rounded-2xl shadow-2xl w-[400px] animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-yellow-400 p-3 rounded-2xl shadow-md mb-3">
            <NotebookPen className="text-white" size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Start your note-taking journey today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <p className="bg-red-100 border border-red-300 text-red-600 px-3 py-2 rounded-md text-sm text-center font-medium">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder=""
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 bg-white/60 backdrop-blur-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder=""
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 bg-white/60 backdrop-blur-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters long.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-yellow-500 hover:shadow-lg transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-yellow-500 font-semibold hover:underline transition"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
