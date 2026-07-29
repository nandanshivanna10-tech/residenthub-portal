import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Wrench,
  Users,
  Megaphone,
  Wallet,
  Calendar,
  BookUser,
  User,
  Building2,
  Lock,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { name: "Maintenance", path: "/maintenance", icon: Wrench },
  { name: "Visitors", path: "/visitors", icon: Users },
  { name: "Announcements", path: "/announcements", icon: Megaphone },
  { name: "Bills", path: "/bills", icon: Wallet },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Directory", path: "/directory", icon: BookUser },
  { name: "Profile", path: "/profile", icon: User },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="bg-blue-600 text-white rounded-lg p-2">
          <Building2 size={20} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 leading-tight">ResidentHub</p>
          <p className="text-xs text-gray-400 tracking-wide">COMMUNITY</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 p-3 rounded-lg bg-gray-50 flex items-center gap-2">
        <Lock size={16} className="text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-800">Tower B - 402</p>
          <p className="text-xs text-gray-400">Resident Portal Mode</p>
        </div>
      </div>
    </aside>
  );
}
