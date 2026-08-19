import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import api from "../../api/axios";

const categoryOptions = ["Cultural", "Health & Wellness", "Sports", "Social"];

const categoryColorMap = {
  Cultural: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  "Health & Wellness": "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
  Sports: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  Social: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
};

const defaultFallback = "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=500&auto=compress";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cultural");
  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCategory("Cultural");
    setDescription("");
    setOrganizer("");
    setDate("");
    setLocation("");
    setImageUrl("");
    setImagePreview("");
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreateForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (e) => {
    setEditingId(e._id);
    setTitle(e.title);
    setCategory(e.category);
    setDescription(e.description);
    setOrganizer(e.organizer || "");
    setDate(e.date ? new Date(e.date).toISOString().slice(0, 16) : "");
    setLocation(e.location);
    setImageUrl(e.imageUrl || "");
    setImagePreview(e.imageUrl || "");
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleImageSelect = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImageUrl(res.data.imageUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!title || !description || !date || !location) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const payload = { title, category, description, organizer, date, location, imageUrl };
      if (editingId) {
        await api.put(`/events/${editingId}`, payload);
        setSuccess("Event updated");
      } else {
        await api.post("/events", payload);
        setSuccess("Event created");
      }
      resetForm();
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    setError("");
    setSuccess("");
    setDeletingId(id);
    try {
      await api.delete(`/events/${id}`);
      setSuccess("Event deleted");
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };

  const formatEventDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Manage Events</h2>
          <p className="text-gray-500 dark:text-gray-400">Create, edit, and remove community events</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
        >
          <Plus size={16} /> New Event
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
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No events yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {events.map((e) => (
            <div
              key={e._id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors"
            >
              <img
                src={e.imageUrl || defaultFallback}
                alt={e.title}
                className="w-full h-40 object-cover bg-gray-100 dark:bg-gray-800"
                onError={(ev) => {
                  ev.target.onerror = null;
                  ev.target.src = defaultFallback;
                }}
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColorMap[e.category] || categoryColorMap.Social}`}>
                    {e.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(e)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(e._id)}
                      disabled={deletingId === e._id}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 dark:text-red-400 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{e.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{e.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{formatEventDate(e.date)}</span>
                  <span>+{e.attendeeCount || 0} going</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">{e.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {editingId ? "Edit Event" : "New Event"}
              </h3>
              <button onClick={resetForm} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Organizer</label>
                <input
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g., Cultural Society Board"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Clubhouse Lawn"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Photo</label>

                {imagePreview ? (
                  <div className="relative mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                        <p className="text-white text-sm">Uploading...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg py-6 text-gray-500 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-600 transition"
                  >
                    <Upload size={20} />
                    <span className="text-sm">Tap to choose a photo from your device</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? "..." : editingId ? "Save Changes" : "Create Event"}
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
