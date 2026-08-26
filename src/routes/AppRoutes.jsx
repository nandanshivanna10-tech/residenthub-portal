import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminLayout from "../components/layout/AdminLayout";
import SecurityLayout from "../components/layout/SecurityLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Maintenance from "../pages/Maintenance";
import Visitors from "../pages/Visitors";
import Announcements from "../pages/Announcements";
import Bills from "../pages/Bills";
import Events from "../pages/Events";
import Directory from "../pages/Directory";
import Profile from "../pages/Profile";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminMaintenance from "../pages/admin/AdminMaintenance";
import AdminVisitors from "../pages/admin/AdminVisitors";
import AdminAnnouncements from "../pages/admin/AdminAnnouncements";
import AdminBills from "../pages/admin/AdminBills";
import AdminEvents from "../pages/admin/AdminEvents";
import AdminDirectory from "../pages/admin/AdminDirectory";
import AdminProfile from "../pages/admin/AdminProfile";

import SecurityDashboard from "../pages/security/SecurityDashboard";
import SecurityVisitors from "../pages/security/SecurityVisitors";
import SecurityDirectory from "../pages/security/SecurityDirectory";
import SecurityProfile from "../pages/security/SecurityProfile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["resident"]}>
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

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/maintenance" element={<AdminMaintenance />} />
        <Route path="/admin/visitors" element={<AdminVisitors />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/bills" element={<AdminBills />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/directory" element={<AdminDirectory />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["security"]}>
            <SecurityLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/security/dashboard" element={<SecurityDashboard />} />
        <Route path="/security/visitors" element={<SecurityVisitors />} />
        <Route path="/security/directory" element={<SecurityDirectory />} />
        <Route path="/security/profile" element={<SecurityProfile />} />
      </Route>
    </Routes>
  );
}
