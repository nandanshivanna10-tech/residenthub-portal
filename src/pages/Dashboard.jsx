import { Wrench, Users, Calendar, DollarSign } from "lucide-react";
import StatCard from "../components/ui/StatCard";

const announcements = [
  {
    tag: "Alert",
    tagColor: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
    title: "Annual Fire Safety Drill & Elevator Check",
    desc: "Please note that elevators in Block B will be closed temporarily for routine load testing and maintenance check-ups.",
    time: "Today",
  },
  {
    tag: "Notice",
    tagColor: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    title: "Clubhouse Gym Equipment Upgrade Complete",
    desc: "We are thrilled to announce that new heavy-duty treadmills and dynamic cable crossover units have been successfully installed.",
    time: "Yesterday",
  },
  {
    tag: "Event",
    tagColor: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
    title: "Inter-Society Table Tennis Tournament 2026",
    desc: "Registration closes this Friday. Resident champions of all age brackets are invited to apply at the reception.",
    time: "3 days ago",
  },
];

const events = [
  { date: "12", label: "TT Tournament", time: "5:30 PM • Clubhouse", color: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400" },
  { date: "19", label: "Security Committee", time: "7:00 PM • Conf. Room", color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400" },
];

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Good Morning, Rahul!</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Here's what's happening in ResidentHub today.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Pending Maintenance"
          value="3"
          subtext="2 in progress"
          icon={<Wrench size={18} className="text-red-500" />}
          bg="bg-red-50 dark:bg-red-950"
        />
        <StatCard
          label="Visitors Today"
          value="5"
          subtext="Next expected: 2:00 PM"
          icon={<Users size={18} className="text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          label="Upcoming Events"
          value="2"
          subtext="Clubhouse meeting tonight"
          icon={<Calendar size={18} className="text-green-500" />}
          bg="bg-green-50 dark:bg-green-950"
        />
        <StatCard
          label="Bills Due"
          value="1"
          subtext="Due in 5 days ($120.00)"
          icon={<DollarSign size={18} className="text-yellow-500" />}
          bg="bg-yellow-50 dark:bg-yellow-950"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Announcements</h3>
            <a href="/announcements" className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {announcements.map((a, i) => (
              <div key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.tagColor}`}>
                    {a.tag}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{a.time}</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100 mt-2">{a.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {events.map((e, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${e.color}`}>
                  {e.date}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{e.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
