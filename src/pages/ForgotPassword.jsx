import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import logo from "../assets/logo.jpeg";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      if (res.data.resetUrl) {
        setResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 transition-colors items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Code Morphicx" className="w-20 h-20 object-contain mb-2" />
          <div className="bg-blue-600 text-white rounded-xl p-3 mb-3">
            <Building2 size={28} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reset Your Password</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-center text-sm">
            Enter your account email and we'll generate a reset link
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm transition-colors">
          {error ? (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          ) : null}
          {message ? (
            <div className="mb-4 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">
              {message}
            </div>
          ) : null}
          {resetUrl ? (
            <div className="mb-4 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs break-all">
              <p className="font-medium mb-1">Demo mode (no email service configured):</p>
              <Link to={resetUrl.replace(window.location.origin, "")} className="underline">
                {resetUrl}
              </Link>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={function (e) { setEmail(e.target.value); }}
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
