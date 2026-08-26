import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Sun, Moon } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { darkMode, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 transition-colors relative items-center justify-center">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-10 p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
        title="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-sm px-8">
        <img src={logo} alt="Code Morphicx" className="w-20 h-20 object-contain mx-auto mb-4" />
        <div className="bg-blue-600 text-white rounded-xl p-3 mb-4 w-fit mx-auto">
          <Building2 size={28} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
          Forgot Password
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6 text-center text-sm">
          Enter your email and we'll send you a reset link
        </p>

        <div className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm transition-colors">
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <Link to="/" className="text-blue-600 dark:text-blue-400 font-medium">
                Back to Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
