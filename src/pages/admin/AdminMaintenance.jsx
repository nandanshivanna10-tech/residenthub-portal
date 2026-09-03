import { useState, useEffect } from "react";
import api from "../../api/axios";

const statusOptions = ["Pending", "In Progress", "Completed"];

const statusColorMap = {
  Pending: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400",
  "In Progress": "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  Completed: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
};

const priorityColorMap = {
  Low: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
  Medium: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  High: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
};

export default function AdminMaintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/maintenance");
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/maintenance/${id}/status`, { status: newStatus });
      setSuccess("Status updated");
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests =
    statusFilter === "All" ? requests : requests.filter((r) => r.status === statusFilter);

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">All Maintenance Requests</h2>
          <p className="text-gray-500 dark:text-gray-400">View and manage requests submitted by residents</p>
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
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Resident</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  No maintenance requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((r) => (
                <tr key={r._id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                    #{r._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    <p className="font-medium">{r.user?.fullName || "Unknown"}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {r.user?.tower} {r.user?.unit ? `- ${r.user.unit}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.category}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs">{r.description}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColorMap[r.priority] || priorityColorMap.Low}`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColorMap[r.status] || statusColorMap.Pending}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r._id, e.target.value)}
                      disabled={updatingId === r._id}
                      className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 disabled:opacity-60"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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
