import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";

const typeMap = {
  All: "All",
  Notices: "Notice",
  Alerts: "Alert",
  Events: "Event",
};

const badgeColorMap = {
  Alert: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
  Notice: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  Event: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
};

const borderColorMap = {
  Alert: "border-l-4 border-red-500",
  Notice: "border-l-4 border-blue-500",
  Event: "border-l-4 border-green-500",
};

export default function Announcements() {
  const { t } = useLanguage();
  const [active, setActive] = useState("All");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filters = [
    { key: "All", label: t("all") },
    { key: "Notices", label: t("notices") },
    { key: "Alerts", label: t("alerts") },
    { key: "Events", label: t("eventsFilter") },
  ];

  const fetchAnnouncements = async (filterKey) => {
    try {
      setLoading(true);
      const typeParam = typeMap[filterKey];
      const res = await api.get(`/announcements${typeParam !== "All" ? `?type=${typeParam}` : ""}`);
      setAnnouncements(res.data);
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(active);
  }, [active]);

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (days === 0) {
      return `${t("today")} • ${new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }
    if (days === 1) return t("yesterday");
    return `${days} days ago`;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("announcementsTitle")}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{t("announcementsSubtitle")}</p>

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
          placeholder={t("searchAnnouncements")}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 w-full sm:w-64"
        />
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No announcements found</p>
        ) : (
          announcements.map((a) => (
            <div
              key={a._id}
              className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors ${borderColorMap[a.type] || ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColorMap[a.type] || badgeColorMap.Notice}`}>
                  {a.type}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{formatTimeAgo(a.createdAt)}</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{a.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{a.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {t("postedBy")}: {a.postedBy}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
