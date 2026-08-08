import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const titles = {
  "/dashboard": "Dashboard",
  "/maintenance": "Maintenance",
  "/visitors": "Visitors",
  "/announcements": "Announcements",
  "/bills": "Bills",
  "/events": "Events",
  "/directory": "Directory",
  "/profile": "Profile",
};

export default function DashboardLayout() {
  const location = useLocation();
  const title = titles[location.pathname] || "ResidentHub";

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#f8f9fb] dark:bg-gray-950 transition-colors">
        <Topbar title={title} />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
