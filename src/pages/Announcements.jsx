import { useState } from "react";

const allAnnouncements = [
  {
    type: "Alerts",
    tag: "Emergency Alert",
    badgeColor: "bg-red-100 text-red-600",
    borderColor: "border-l-4 border-red-500",
    title: "Annual Fire Safety & Smoke Detector System Audit",
    desc: "Attention Residents: The management and security team will execute an overall building system safety check tomorrow. Alarms will ring intermittently in blocks A and B between 1:00 PM and 4:00 PM. Please do not panic during active test buzzers. Keep your doors closed to prevent dust penetration from shaft checks.",
    postedBy: "Resident Welfare Association (RWA)",
    time: "Posted Today • 10:00 AM",
  },
  {
    type: "Notices",
    tag: "Notice",
    badgeColor: "bg-blue-100 text-blue-600",
    borderColor: "border-l-4 border-blue-500",
    title: "Upgrade of Gym Treadmills Complete inside Clubhouse",
    desc: "We are pleased to inform that all outdated treadmills and exercise cycles in the health wing have been successfully swapped out for new high-performance gym stations. All current active members can gain access starting today at normal morning slots.",
    postedBy: "Sports & Gym Committee",
    time: "Posted Yesterday • 3:45 PM",
  },
  {
    type: "Events",
    tag: "Society Event",
    badgeColor: "bg-green-100 text-green-600",
    borderColor: "border-l-4 border-green-500",
    title: "Community Holi Celebration 2026 - Registrations Open",
    desc: "Let us get together to celebrate the vibrant colours of life and love! Registration for food stalls, cultural stage plays, and organic colors collection has kicked off. Families who wish to set up performance stalls are requested to fill forms near the desk.",
    postedBy: "Cultural Society Board",
    time: "Posted 4 days ago",
  },
];

const filters = ["All", "Notices", "Alerts", "Events"];

export default function Announcements() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? allAnnouncements
      : allAnnouncements.filter((a) => a.type === active);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
      <p className="text-gray-500 mb-4">
        Stay updated with community notices, active emergency alerts, and events
      </p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                active === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          placeholder="Search announcements..."
          className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm w-full sm:w-64"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((a, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl border border-gray-200 p-5 ${a.borderColor}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.badgeColor}`}>
                {a.tag}
              </span>
              <span className="text-xs text-gray-400">{a.time}</span>
            </div>
            <p className="font-semibold text-gray-900 mb-1">{a.title}</p>
            <p className="text-sm text-gray-500 mb-2">{a.desc}</p>
            <p className="text-xs text-gray-500 font-medium">Posted by: {a.postedBy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
