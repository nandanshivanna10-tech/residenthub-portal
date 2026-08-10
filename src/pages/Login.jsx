import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.jpeg";

export default function Login() {
  const [role, setRole] = useState("Resident");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="w-full md:w-1/2 flex flex-col px-8 pt-6">
        <img src={logo} alt="Code Morphicx" className="w-14 h-14 object-contain mb-4" />

        <div className="flex-1 flex flex-col items-center justify-center -mt-14">
          <div className="bg-blue-600 text-white rounded-xl p-3 mb-4">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome to ResidentHub</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 mb-8 text-center">
            Manage your apartment, bills, & visitors in one place
          </p>

          <div className="w-full max-w-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm transition-colors">
            <div className="flex bg-gray-50 dark:bg-gray-800 rounded-lg p-1 mb-6">
              {["Resident", "Admin", "Security"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                    role === r
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  defaultValue="rahul.sharma@gmail.com"
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <a href="#" className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    defaultValue="password123"
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
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

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Sign In
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 font-medium">
                  Create Account
                </a>
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
