import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLanguage } from "../../context/LanguageContext";

export default function DashboardLayout() {
  const location = useLocation();
  const { t } = useLanguage();

  const titleKeys = {
    "/dashboard": "dashboard",
    "/maintenance": "maintenanceTitle",
    "/visitors": "visitors",
    "/announcements": "announcements",
    "/bills": "bills",
    "/events": "events",
    "/directory": "directory",
    "/profile": "profile",
  };

  const title = t(titleKeys[location.pathname] || "dashboard");

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
