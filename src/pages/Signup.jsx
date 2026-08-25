import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tower, setTower] = useState("");
  const [unit, setUnit] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !password || !tower || !unit) {
      setError("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await signup({ fullName, email, phone, password, tower, unit, role: "resident" });
      navigate("/dashboard");
    } catch (err) {
      let msg = "Signup failed. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="w-full flex flex-col items-center justify-center px-8 py-10">
        <img src={logo} alt="Code Morphicx" className="w-20 h-20 object-contain mb-2" />
        <div className="bg-blue-600 text-white rounded-xl p-3 mb-4">
          <Building2 size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Your Account</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 mb-8 text-center">
          Join ResidentHub as a resident
        </p>

        <div className="w-full max-w-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm transition-colors">
          {error ? (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                value={fullName}
                onChange={function (e) { setFullName(e.target.value); }}
                className="mt-1 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={function (e) { setEmail(e.target.value); }}
                className="mt-1 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                value={phone}
                onChange={function (e) { setPhone(e.target.value); }}
                className="mt-1 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tower</label>
                <input
                  value={tower}
                  onChange={function (e) { setTower(e.target.value); }}
                  placeholder="Tower B"
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                <input
                  value={unit}
                  onChange={function (e) { setUnit(e.target.value); }}
                  placeholder="402"
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={function (e) { setPassword(e.target.value); }}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={function () { setShowPassword(!showPassword); }}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
  );
}
