import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Topbar from "./Topbar";

const titles = {
  "/admin/dashboard": "Admin Dashboard",
  "/admin/maintenance": "Maintenance Requests",
  "/admin/visitors": "Visitors",
  "/admin/announcements": "Manage Announcements",
  "/admin/bills": "Manage Bills",
  "/admin/events": "Manage Events",
  "/admin/directory": "Directory",
  "/admin/profile": "My Profile",
};

export default function AdminLayout() {
  const location = useLocation();
  const title = titles[location.pathname] || "Admin Panel";

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-[#f8f9fb] dark:bg-gray-950 transition-colors">
        <Topbar title={title} />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
