import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../../api/axios";

const statusOptions = ["Unpaid", "Paid"];

const statusColorMap = {
  Unpaid: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400",
  Paid: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
};

export default function AdminBills() {
  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "All" ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await api.get(`/bills/all${params}`);
      setBills(res.data);
    } catch (err) {
      setError("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await api.get("/directory");
      setResidents(res.data);
    } catch (err) {
      setError("Failed to load residents list");
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  useEffect(() => {
    fetchBills();
  }, [statusFilter]);

  const resetForm = () => {
    setUserId("");
    setType("");
    setAmount("");
    setDueDate("");
    setShowForm(false);
  };

  const openCreateForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !type || !amount || !dueDate) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/bills", { userId, type, amount: parseFloat(amount), dueDate });
      setSuccess("Bill created successfully");
      resetForm();
      fetchBills();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bill");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    setError("");
    setSuccess("");
    setDeletingId(id);
    try {
      await api.delete(`/bills/${id}`);
      setSuccess("Bill deleted");
      fetchBills();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete bill");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Manage Bills</h2>
          <p className="text-gray-500 dark:text-gray-400">Create and track bills for residents</p>
        </div>
        <div className="flex gap-3">
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
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            <Plus size={16} /> New Bill
          </button>
        </div>
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
              <th className="px-4 py-3">Resident</th>
              <th className="px-4 py-3">Bill Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Paid On</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  No bills found
                </td>
              </tr>
            ) : (
              bills.map((b) => (
                <tr key={b._id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 dark:text-gray-100">{b.user?.fullName || "Unknown"}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {b.user?.tower} {b.user?.unit ? `- ${b.user.unit}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{b.type}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">${b.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(b.dueDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColorMap[b.status] || statusColorMap.Unpaid}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(b.paidOn)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(b._id)}
                      disabled={deletingId === b._id}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 dark:text-red-400 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">New Bill</h3>
              <button onClick={resetForm} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resident</label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select resident</option>
                  {residents.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.fullName} ({r.tower} - {r.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill Type</label>
                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g., Maintenance Fee, Water Meter Charge"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 120.00"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? "..." : "Create Bill"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
