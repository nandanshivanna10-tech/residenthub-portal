import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../api/axios";

const typeOptions = ["Notice", "Alert", "Event"];

const badgeColorMap = {
  Alert: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
  Notice: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  Event: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
};

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [type, setType] = useState("Notice");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setType("Notice");
    setTitle("");
    setDescription("");
    setPostedBy("");
    setEditingId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (a) => {
    setEditingId(a._id);
    setType(a.type);
    setTitle(a.title);
    setDescription(a.description);
    setPostedBy(a.postedBy);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !postedBy) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await api.put(`/announcements/${editingId}`, { type, title, description, postedBy });
        setSuccess("Announcement updated");
      } else {
        await api.post("/announcements", { type, title, description, postedBy });
        setSuccess("Announcement created");
      }
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      console.error("Save announcement error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    setError("");
    setSuccess("");
    setDeletingId(id);
    try {
      await api.delete(`/announcements/${id}`);
      setSuccess("Announcement deleted");
      fetchAnnouncements();
    } catch (err) {
      console.error("Delete announcement error:", err.response?.status, err.response?.data || err.message);
      setError(
        err.response?.data?.message
          ? `Failed to delete: ${err.response.data.message}`
          : `Failed to delete announcement (status ${err.response?.status || "unknown"})`
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Manage Announcements</h2>
          <p className="text-gray-500 dark:text-gray-400">Create, edit, and remove community notices, alerts, and events</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
        >
          <Plus size={16} /> New Announcement
        </button>
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
      ) : announcements.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No announcements yet</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColorMap[a.type] || badgeColorMap.Notice}`}>
                  {a.type}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(a)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    disabled={deletingId === a._id}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 dark:text-red-400 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{a.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{a.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Posted by: {a.postedBy}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {editingId ? "Edit Announcement" : "New Announcement"}
              </h3>
              <button onClick={resetForm} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                >
                  {typeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Posted By</label>
                <input
                  value={postedBy}
                  onChange={(e) => setPostedBy(e.target.value)}
                  placeholder="e.g., Resident Welfare Association (RWA)"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? "..." : editingId ? "Save Changes" : "Create Announcement"}
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
