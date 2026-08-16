import { NavLink } from "react-router-dom";
import {
  LayoutGrid, Wrench, Users, Megaphone, Wallet, Calendar, BookUser, Building2, Bell,
} from "lucide-react";
import logo from "../../assets/logo.jpeg";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutGrid },
  { name: "Maintenance", path: "/admin/maintenance", icon: Wrench },
  { name: "Visitors", path: "/admin/visitors", icon: Users },
  { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
  { name: "Bills", path: "/admin/bills", icon: Wallet },
  { name: "Events", path: "/admin/events", icon: Calendar },
  { name: "Directory", path: "/admin/directory", icon: BookUser },
];

export default function AdminSidebar() {
  return (
    <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen sticky top-0 transition-colors">
      <div className="flex items-center gap-2 px-5 pt-5 pb-2">
        <img src={logo} alt="Code Morphicx" className="w-16 h-16 object-contain" />
      </div>

      <div className="flex items-start gap-2 px-5 pb-5">
        <div className="bg-purple-600 text-white rounded-lg p-2">
          <Building2 size={20} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100 leading-tight text-sm">
            ResidentHub
          </p>
          <p className="text-xs font-normal text-gray-500 dark:text-gray-400 leading-tight">
            by Code Morphicx
          </p>
          <p className="text-xs text-purple-500 dark:text-purple-400 tracking-wide mt-0.5 font-medium">
            ADMIN PANEL
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
                  ? "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
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
        <Bell size={16} className="text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Admin Access</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Full Management Mode</p>
        </div>
      </div>
    </aside>
  );
}
