import { Outlet, useLocation } from "react-router-dom";
import SecuritySidebar from "./SecuritySidebar";
import Topbar from "./Topbar";

const titles = {
  "/security/dashboard": "Security Dashboard",
  "/security/visitors": "Visitor Check-In",
  "/security/directory": "Directory",
};

export default function SecurityLayout() {
  const location = useLocation();
  const title = titles[location.pathname] || "Security Panel";

  return (
    <div className="flex">
      <SecuritySidebar />
      <div className="flex-1 min-h-screen bg-[#f8f9fb] dark:bg-gray-950 transition-colors">
        <Topbar title={title} />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
