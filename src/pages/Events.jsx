import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";
import holiImg from "../assets/events/holi.jpg";

const categoryColorMap = {
  Cultural: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  "Health & Wellness": "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
  Sports: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  Social: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
};

const fallbackImageMap = {
  Cultural: "https://images.pexels.com/photos/1387037/pexels-photo-1387037.jpeg?w=500&auto=compress",
  "Health & Wellness": "https://images.pexels.com/photos/863926/pexels-photo-863926.jpeg?w=500&auto=compress",
  Sports: "https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?w=500&auto=compress",
  Social: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=500&auto=compress",
};

const defaultFallback = "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=500&auto=compress";

export default function Events() {
  const { t } = useLanguage();
  const [active, setActive] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvpingId, setRsvpingId] = useState(null);

  const filters = [
    { key: "All", label: t("all") },
    { key: "Upcoming", label: t("upcoming") },
    { key: "Past", label: t("past") },
    { key: "My Events", label: t("myEvents") },
  ];

  const fetchEvents = async (filterKey) => {
    try {
      setLoading(true);
      const filterParam = filterKey !== "All" ? `?filter=${encodeURIComponent(filterKey)}` : "";
      const res = await api.get(`/events${filterParam}`);
      setEvents(res.data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(active);
  }, [active]);

  const handleRsvp = async (id) => {
    setRsvpingId(id);
    try {
      await api.patch(`/events/${id}/rsvp`);
      fetchEvents(active);
    } catch (err) {
      setError("Failed to update RSVP");
    } finally {
      setRsvpingId(null);
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
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("communityEvents")}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{t("communityEventsSubtitle")}</p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                active === f.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          placeholder={t("searchEvents")}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 w-full sm:w-64"
        />
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No events found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {events.map((e) => (
            <div
              key={e._id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors"
            >
              <img
                src={e.imageUrl || fallbackImageMap[e.category] || defaultFallback}
                alt={e.title}
                className="w-full h-40 object-cover bg-gray-100 dark:bg-gray-800"
                onError={(ev) => {
                  ev.target.onerror = null;
                  ev.target.src = defaultFallback;
                }}
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      categoryColorMap[e.category] || categoryColorMap.Social
                    }`}
                  >
                    {e.category}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{e.organizer}</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{e.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{e.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>{formatEventDate(e.date)}</span>
                  <span>+{e.attendeeCount || 0} going</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{e.location}</p>
                <button
                  onClick={() => handleRsvp(e._id)}
                  disabled={rsvpingId === e._id}
                  className={`w-full py-2 rounded-lg text-sm font-medium disabled:opacity-60 ${
                    e.isRegistered
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {rsvpingId === e._id ? "..." : e.isRegistered ? t("registeredBtn") : t("rsvpRegister")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
