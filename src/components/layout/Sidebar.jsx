import { NavLink } from "react-router-dom";
import {
  LayoutGrid, Wrench, Users, Megaphone, Wallet, Calendar, BookUser, User, Building2, Lock,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Sidebar() {
  const { t } = useLanguage();

  const navItems = [
    { name: t("dashboard"), path: "/dashboard", icon: LayoutGrid },
    { name: t("maintenance"), path: "/maintenance", icon: Wrench },
    { name: t("visitors"), path: "/visitors", icon: Users },
    { name: t("announcements"), path: "/announcements", icon: Megaphone },
    { name: t("bills"), path: "/bills", icon: Wallet },
    { name: t("events"), path: "/events", icon: Calendar },
    { name: t("directory"), path: "/directory", icon: BookUser },
    { name: t("profile"), path: "/profile", icon: User },
  ];

  return (
    <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen sticky top-0 transition-colors">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="bg-blue-600 text-white rounded-lg p-2">
          <Building2 size={20} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">ResidentHub</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 tracking-wide">COMMUNITY</p>
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
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
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
        <Lock size={16} className="text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Tower B - 402</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Resident Portal Mode</p>
        </div>
      </div>
    </aside>
  );
}
