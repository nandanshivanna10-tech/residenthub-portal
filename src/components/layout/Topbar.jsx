import { Search, Bell } from "lucide-react";

export default function Topbar({ title }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-9 pr-4 py-2 w-64 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button className="relative">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-800 leading-tight">
              Rahul Sharma
            </p>
            <p className="text-xs text-gray-400">Resident Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
