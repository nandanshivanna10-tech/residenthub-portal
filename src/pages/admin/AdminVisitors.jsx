import { useState, useEffect } from "react";
import api from "../../api/axios";

const statusOptions = ["Expected", "Checked In", "Checked Out", "Revoked"];

const statusColorMap = {
  Expected: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  "Checked In": "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400",
  "Checked Out": "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  Revoked: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actingId, setActingId] = useState(null);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "All" ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await api.get(`/visitors/all${params}`);
      setVisitors(res.data);
    } catch (err) {
      setError("Failed to load visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [statusFilter]);

  const handleCheckIn = async (id) => {
    setActingId(id);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/visitors/${id}/check-in`);
      setSuccess("Visitor checked in");
      fetchVisitors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check in visitor");
    } finally {
      setActingId(null);
    }
  };

  const handleCheckOut = async (id) => {
    setActingId(id);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/visitors/${id}/check-out`);
      setSuccess("Visitor checked out");
      fetchVisitors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check out visitor");
    } finally {
      setActingId(null);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">All Visitors</h2>
          <p className="text-gray-500 dark:text-gray-400">View and manage visitors across all units</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        >
          <option value="All">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}
      {success && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-green-400 hover:text-green-600">✕</button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
            <tr>
              <th className="px-4 py-3">Visitor</th>
              <th className="px-4 py-3">Resident / Unit</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Expected</th>
              <th className="px-4 py-3">Check-in</th>
              <th className="px-4 py-3">Check-out</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : visitors.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  No visitors found
                </td>
              </tr>
            ) : (
              visitors.map((v) => (
                <tr key={v._id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 dark:text-gray-100">{v.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{v.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    <p>{v.user?.fullName || "Unknown"}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {v.user?.tower} {v.user?.unit ? `- ${v.user.unit}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{v.purpose || "-"}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDateTime(v.expectedAt)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDateTime(v.checkInTime)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDateTime(v.checkOutTime)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColorMap[v.status] || statusColorMap.Expected}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {v.status === "Expected" && (
                        <button
                          onClick={() => handleCheckIn(v._id)}
                          disabled={actingId === v._id}
                          className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium disabled:opacity-60"
                        >
                          Check In
                        </button>
                      )}
                      {v.status === "Checked In" && (
                        <button
                          onClick={() => handleCheckOut(v._id)}
                          disabled={actingId === v._id}
                          className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium disabled:opacity-60"
                        >
                          Check Out
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
