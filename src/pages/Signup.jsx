import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Eye, EyeOff, Sun, Moon } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tower, setTower] = useState("");
  const [unit, setUnit] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const { signup } = useAuth();
  const navigate = useNavigate();

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
      const newUser = await signup({
        fullName,
        email,
        phone,
        password,
        role: "resident",
        tower,
        unit,
        status: "owner",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 transition-colors relative">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-10 p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
        title="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full md:w-1/2 flex flex-col px-8 pt-6 overflow-y-auto">
        <img src={logo} alt="Code Morphicx" className="w-24 h-24 object-contain mb-2" />

        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="bg-blue-600 text-white rounded-xl p-3 mb-4">
            <Building2 size={28} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
            Create Your Account
          </h1>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400 -mt-0.5">
            by Code Morphicx
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-3 mb-6 text-center">
            Join ResidentHub to manage your apartment life
          </p>

          <div className="w-full max-w-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm transition-colors">
            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tower</label>
                  <input
                    value={tower}
                    onChange={(e) => setTower(e.target.value)}
                    placeholder="Tower B"
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                  <input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="402"
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 mt-2"
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/" className="text-blue-600 dark:text-blue-400 font-medium">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-blue-600 dark:bg-blue-800 items-end p-16 transition-colors">
        <div>
          <h2 className="text-white text-2xl font-bold mb-3">
            Modern Living, Perfectly Streamlined
          </h2>
          <p className="text-blue-100 max-w-md">
            Join thousands of smart apartment residents who enjoy prompt
            maintenance, digital visitor registration, and direct digital billing.
          </p>
        </div>
      </div>
    </div>
  );
}
