import { useState } from "react";

const allEvents = [
  {
    status: "Upcoming",
    category: "Cultural",
    catColor: "bg-orange-100 text-orange-600",
    org: "Organized by Cultural Society Board",
    title: "Holi Celebration 2026",
    desc: "Join us for the ultimate community festival of colors! Includes organic color distribution, sweet stalls, cultural dances, and live DJ performance.",
    date: "Mar 15, 2026 • 4:00 PM",
    location: "Clubhouse Lawn",
    going: "+120 going",
    action: "RSVP / Register",
    registered: false,
    image: "https://images.unsplash.com/photo-1615488023410-fb03deb28e37?w=500",
  },
  {
    status: "Upcoming",
    category: "Health & Wellness",
    catColor: "bg-green-100 text-green-600",
    org: "Health Committee",
    title: "Yoga & Wellness Workshop",
    desc: "A rejuvenating morning of deep breathing, therapeutic stretching, and mindfulness meditation led by certified professional instructors.",
    date: "Feb 20, 2026 • 7:00 AM",
    location: "Terrace Garden",
    going: "+38 going",
    action: "Registered",
    registered: true,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500",
  },
];

const filters = ["All", "Upcoming", "Past", "My Events"];

export default function Events() {
  const [active, setActive] = useState("All");

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Community Events</h2>
      <p className="text-gray-500 mb-4">Discover and participate in upcoming society events and activities</p>

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
          placeholder="Search events..."
          className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm w-full sm:w-64"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {allEvents.map((e, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <img src={e.image} alt={e.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.catColor}`}>
                  {e.category}
                </span>
                <span className="text-xs text-gray-400">{e.org}</span>
              </div>
              <p className="font-semibold text-gray-900 mb-1">{e.title}</p>
              <p className="text-sm text-gray-500 mb-3">{e.desc}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <span>{e.date}</span>
                <span>{e.going}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{e.location}</p>
              <button
                className={`w-full py-2 rounded-lg text-sm font-medium ${
                  e.registered
                    ? "bg-blue-50 text-blue-600"
                    : "bg-blue-600 text-white"
                }`}
              >
                {e.registered ? "✓ Registered" : e.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
