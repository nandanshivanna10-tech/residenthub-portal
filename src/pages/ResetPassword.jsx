import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Building2, Eye, EyeOff, Sun, Moon } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The link may have expired.");
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
          Reset Password
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6 text-center text-sm">
          Enter your new password below
        </p>

        <div className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm transition-colors">
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          {success ? (
            <div className="text-center">
              <p className="text-green-600 dark:text-green-400 text-sm mb-4">
                Password reset successful! Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                {submitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            <Link to="/" className="text-blue-600 dark:text-blue-400 font-medium">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
