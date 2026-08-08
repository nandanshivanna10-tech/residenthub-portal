import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const allEvents = [
  {
    category: "Cultural",
    catColor: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
    org: "Organized by Cultural Society Board",
    title: "Holi Celebration 2026",
    desc: "Join us for the ultimate community festival of colors! Includes organic color distribution, sweet stalls, cultural dances, and live DJ performance.",
    date: "Mar 15, 2026 • 4:00 PM",
    location: "Clubhouse Lawn",
    going: "+120 going",
    registered: false,
    image: "https://images.unsplash.com/photo-1615488023410-fb03deb28e37?w=500",
  },
  {
    category: "Health & Wellness",
    catColor: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
    org: "Health Committee",
    title: "Yoga & Wellness Workshop",
    desc: "A rejuvenating morning of deep breathing, therapeutic stretching, and mindfulness meditation led by certified professional instructors.",
    date: "Feb 20, 2026 • 7:00 AM",
    location: "Terrace Garden",
    going: "+38 going",
    registered: true,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500",
  },
];

export default function Events() {
  const { t } = useLanguage();
  const [active, setActive] = useState("All");

  const filters = [
    { key: "All", label: t("all") },
    { key: "Upcoming", label: t("upcoming") },
    { key: "Past", label: t("past") },
    { key: "My Events", label: t("myEvents") },
  ];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {allEvents.map((e, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <img src={e.image} alt={e.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.catColor}`}>
                  {e.category}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{e.org}</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{e.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{e.desc}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>{e.date}</span>
                <span>{e.going}</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{e.location}</p>
              <button
                className={`w-full py-2 rounded-lg text-sm font-medium ${
                  e.registered
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "bg-blue-600 text-white"
                }`}
              >
                {e.registered ? t("registeredBtn") : t("rsvpRegister")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
