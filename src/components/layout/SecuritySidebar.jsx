import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, BookUser, Building2, ShieldCheck, User } from "lucide-react";
import logo from "../../assets/logo.jpeg";

const navItems = [
  { name: "Dashboard", path: "/security/dashboard", icon: LayoutGrid },
  { name: "Visitors", path: "/security/visitors", icon: Users },
  { name: "Directory", path: "/security/directory", icon: BookUser },
  { name: "Profile", path: "/security/profile", icon: User },
];

export default function SecuritySidebar() {
  return (
    <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen sticky top-0 transition-colors">
      <div className="flex items-center gap-2 px-5 pt-5 pb-2">
        <img src={logo} alt="Code Morphicx" className="w-16 h-16 object-contain" />
      </div>

      <div className="flex items-start gap-2 px-5 pb-5">
        <div className="bg-green-600 text-white rounded-lg p-2">
          <Building2 size={20} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100 leading-tight text-sm">
            ResidentHub
          </p>
          <p className="text-xs font-normal text-gray-500 dark:text-gray-400 leading-tight">
            by Code Morphicx
          </p>
          <p className="text-xs text-green-500 dark:text-green-400 tracking-wide mt-0.5 font-medium">
            SECURITY PANEL
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
        <ShieldCheck size={16} className="text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Gate Security</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Check-in Mode</p>
        </div>
      </div>
    </aside>
  );
}
