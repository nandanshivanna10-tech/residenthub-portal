import { useState, useEffect } from "react";
import { Phone, Car } from "lucide-react";
import api from "../../api/axios";

const statusOptions = ["Expected", "Checked In", "Checked Out", "Revoked"];

const statusColorMap = {
  Expected: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  "Checked In": "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400",
  "Checked Out": "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  Revoked: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

export default function SecurityVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("Expected");
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Visitor Check-In</h2>
          <p className="text-gray-500 dark:text-gray-400">Verify and check visitors in or out at the gate</p>
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

      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
      ) : visitors.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No visitors found for this filter</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visitors.map((v) => (
            <div
              key={v._id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600 dark:text-green-400 font-semibold">
                    {v.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{v.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Visiting: {v.user?.fullName} ({v.user?.tower} - {v.user?.unit})
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColorMap[v.status] || statusColorMap.Expected}`}>
                  {v.status}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {v.phone && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Phone size={12} /> {v.phone}
                  </p>
                )}
                {v.vehicleNumber && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Car size={12} /> {v.vehicleNumber}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">Purpose: {v.purpose || "-"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Expected: {formatDateTime(v.expectedAt)}</p>
                {v.checkInTime && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Checked in: {formatDateTime(v.checkInTime)}</p>
                )}
                {v.checkOutTime && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Checked out: {formatDateTime(v.checkOutTime)}</p>
                )}
              </div>

              {v.status === "Expected" && (
                <button
                  onClick={() => handleCheckIn(v._id)}
                  disabled={actingId === v._id}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {actingId === v._id ? "..." : "Check In"}
                </button>
              )}
              {v.status === "Checked In" && (
                <button
                  onClick={() => handleCheckOut(v._id)}
                  disabled={actingId === v._id}
                  className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {actingId === v._id ? "..." : "Check Out"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
