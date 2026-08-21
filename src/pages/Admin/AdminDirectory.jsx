import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../api/axios";

export default function AdminDirectory() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [tower, setTower] = useState("");
  const [unit, setUnit] = useState("");
  const [status, setStatus] = useState("owner");
  const [submitting, setSubmitting] = useState(false);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await api.get(`/directory${params}`);
      setResidents(res.data);
    } catch (err) {
      setError("Failed to load directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchResidents();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setTower("");
    setUnit("");
    setStatus("owner");
    setEditingId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (r) => {
    setEditingId(r._id);
    setFullName(r.fullName);
    setEmail(r.email);
    setPhone(r.phone || "");
    setPassword("");
    setTower(r.tower || "");
    setUnit(r.unit || "");
    setStatus(r.status || "owner");
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await api.put(`/directory/${editingId}`, { fullName, phone, tower, unit, status });
        setSuccess("Resident updated");
      } else {
        if (!fullName || !email || !password || !tower || !unit) return;
        await api.post("/directory", { fullName, email, phone, password, tower, unit, status });
        setSuccess("Resident added");
      }
      resetForm();
      fetchResidents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save resident");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this resident? This will delete their account.")) return;
    setError("");
    setSuccess("");
    setDeletingId(id);
    try {
      await api.delete(`/directory/${id}`);
      setSuccess("Resident removed");
      fetchResidents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove resident");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Directory</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage resident accounts and unit details</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
        >
          <Plus size={16} /> Add Resident
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name or unit..."
        className="mb-4 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 w-full sm:w-80"
      />

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
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Tower</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : residents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  No residents found
                </td>
              </tr>
            ) : (
              residents.map((r) => (
                <tr key={r._id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{r.fullName}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    <p>{r.email}</p>
                    <p className="text-xs">{r.phone || "-"}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.tower || "-"}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.unit || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.status === "owner"
                        ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                        : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                    }`}>
                      {r.status === "owner" ? "Owner" : "Tenant"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditForm(r)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={deletingId === r._id}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 dark:text-red-400 disabled:opacity-50"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {editingId ? "Edit Resident" : "Add Resident"}
              </h3>
              <button onClick={resetForm} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!editingId}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 disabled:opacity-60"
                />
                {editingId && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed</p>
                )}
              </div>

              {!editingId && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Temporary Password</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Resident will use this to log in"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tower</label>
                  <input
                    value={tower}
                    onChange={(e) => setTower(e.target.value)}
                    placeholder="e.g., Tower B"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                  <input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., 402"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                >
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? "..." : editingId ? "Save Changes" : "Add Resident"}
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
