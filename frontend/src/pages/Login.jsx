import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { BookOpenText } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-yellow-100 via-white to-gray-100 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-yellow-300 blur-[120px] opacity-30"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-yellow-400 blur-[120px] opacity-30"></div>

      {/* Login Card */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 p-10 rounded-2xl shadow-2xl w-[400px] animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-yellow-400 p-3 rounded-2xl shadow-md mb-3">
            <BookOpenText className="text-white" size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Sign in to continue your notes journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
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
              placeholder="your@email.com"
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
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 bg-white/60 backdrop-blur-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-yellow-500 hover:shadow-lg transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-yellow-500 font-semibold hover:underline transition"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
