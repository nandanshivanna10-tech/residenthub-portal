import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Maintenance from "../pages/Maintenance";
import Visitors from "../pages/Visitors";
import Announcements from "../pages/Announcements";
import Bills from "../pages/Bills";
import Events from "../pages/Events";
import Directory from "../pages/Directory";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/events" element={<Events />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
