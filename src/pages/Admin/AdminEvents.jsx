import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import api from "../../api/axios";

const categoryOptions = ["Cultural", "Health & Wellness", "Sports", "Social"];

const categoryColorMap = {
  Cultural: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  "Health & Wellness": "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
  Sports: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  Social: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
};

const defaultFallback = "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=500&auto=compress";

function toDatetimeLocalValue(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
}

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cultural");
  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showAttendees, setShowAttendees] = useState(false);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [attendeesData, setAttendeesData] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events?filter=All");
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
    setEditingId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (ev) => {
    setEditingId(ev._id);
    setTitle(ev.title || "");
    setCategory(ev.category || "Cultural");
    setDescription(ev.description || "");
    setOrganizer(ev.organizer || "");
    setDate(toDatetimeLocalValue(ev.date));
    setLocation(ev.location || "");
    setImageUrl(ev.imageUrl || "");
    setShowForm(true);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Image must be under 15MB");
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !location) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        title,
        category,
        description,
        organizer,
        date: new Date(date).toISOString(),
        location,
        imageUrl,
      };
      if (editingId) {
        await api.put("/events/" + editingId, payload);
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
    try {
      await api.delete("/events/" + id);
      setSuccess("Event deleted");
      fetchEvents();
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  const openAttendees = async (id) => {
    setShowAttendees(true);
    setAttendeesLoading(true);
    setAttendeesData(null);
    try {
      const res = await api.get("/events/" + id + "/attendees");
      setAttendeesData(res.data);
    } catch (err) {
      setError("Failed to load attendees");
      setShowAttendees(false);
    } finally {
      setAttendeesLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Manage Events</h2>
          <p className="text-gray-500 dark:text-gray-400">Create, edit, and remove community events with photos</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No events yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors"
            >
              <img
                src={ev.imageUrl || defaultFallback}
                alt={ev.title}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultFallback;
                }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={"text-xs px-2 py-0.5 rounded-full font-medium " + (categoryColorMap[ev.category] || categoryColorMap.Social)}
                  >
                    {ev.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openAttendees(ev._id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                      title="View Attendees"
                    >
                      <Users size={14} />
                    </button>
                    <button
                      onClick={() => openEditForm(ev)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(ev._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 dark:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{ev.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{ev.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">{ev.location}</p>
                  <button
                    onClick={() => openAttendees(ev._id)}
                    className="text-xs text-purple-600 dark:text-purple-400 font-medium"
                  >
                    {ev.attendeeCount || 0} registered
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 w-full max-w-md my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {editingId ? "Edit Event" : "New Event"}
              </h3>
              <button onClick={resetForm} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Photo</label>
                <div className="mt-1 flex items-center gap-3">
                  {imageUrl && (
                    <img src={imageUrl} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleImageClick}
                    disabled={uploadingImage}
                    className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-60"
                  >
                    {uploadingImage ? "Uploading..." : imageUrl ? "Change Photo" : "Upload Photo"}
                  </button>
                </div>
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

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
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

      {showAttendees && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {attendeesData ? "Registered: " + attendeesData.eventTitle : "Registered Attendees"}
              </h3>
              <button onClick={() => setShowAttendees(false)} className="text-gray-400">✕</button>
            </div>

            {attendeesLoading ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
            ) : !attendeesData || attendeesData.attendees.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">No one has registered yet</p>
            ) : (
              <div className="space-y-2">
                {attendeesData.attendees.map((a) => (
                  <div key={a._id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    {a.profilePicture ? (
                      <img src={a.profilePicture} alt={a.fullName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {a.fullName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{a.fullName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {a.tower} {a.unit ? "- " + a.unit : ""} {a.phone ? "• " + a.phone : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
