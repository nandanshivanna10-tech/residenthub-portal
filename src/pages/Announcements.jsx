import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const allAnnouncements = [
  {
    type: "Alerts",
    tag: "Emergency Alert",
    badgeColor: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
    borderColor: "border-l-4 border-red-500",
    title: "Annual Fire Safety & Smoke Detector System Audit",
    desc: "Attention Residents: The management and security team will execute an overall building system safety check tomorrow. Alarms will ring intermittently in blocks A and B between 1:00 PM and 4:00 PM. Please do not panic during active test buzzers. Keep your doors closed to prevent dust penetration from shaft checks.",
    postedBy: "Resident Welfare Association (RWA)",
    time: "Posted Today • 10:00 AM",
  },
  {
    type: "Notices",
    tag: "Notice",
    badgeColor: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    borderColor: "border-l-4 border-blue-500",
    title: "Upgrade of Gym Treadmills Complete inside Clubhouse",
    desc: "We are pleased to inform that all outdated treadmills and exercise cycles in the health wing have been successfully swapped out for new high-performance gym stations. All current active members can gain access starting today at normal morning slots.",
    postedBy: "Sports & Gym Committee",
    time: "Posted Yesterday • 3:45 PM",
  },
  {
    type: "Events",
    tag: "Society Event",
    badgeColor: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
    borderColor: "border-l-4 border-green-500",
    title: "Community Holi Celebration 2026 - Registrations Open",
    desc: "Let us get together to celebrate the vibrant colours of life and love! Registration for food stalls, cultural stage plays, and organic colors collection has kicked off. Families who wish to set up performance stalls are requested to fill forms near the desk.",
    postedBy: "Cultural Society Board",
    time: "Posted 4 days ago",
  },
];

export default function Announcements() {
  const { t } = useLanguage();
  const [active, setActive] = useState("All");

  const filters = [
    { key: "All", label: t("all") },
    { key: "Notices", label: t("notices") },
    { key: "Alerts", label: t("alerts") },
    { key: "Events", label: t("eventsFilter") },
  ];

  const filtered =
    active === "All" ? allAnnouncements : allAnnouncements.filter((a) => a.type === active);

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

      <div className="space-y-4">
        {filtered.map((a, i) => (
          <div key={i} className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors ${a.borderColor}`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.badgeColor}`}>
                {a.tag}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{a.time}</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{a.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{a.desc}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t("postedBy")}: {a.postedBy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
