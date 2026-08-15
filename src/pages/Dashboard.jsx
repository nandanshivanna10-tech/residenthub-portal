import { useState, useEffect } from "react";
import { Wrench, Users, Calendar, DollarSign } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [pendingMaintenance, setPendingMaintenance] = useState(0);
  const [visitorsToday, setVisitorsToday] = useState(0);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [billsDue, setBillsDue] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [maintenanceRes, expectedVisitorsRes, eventsRes, pendingBillsRes, announcementsRes] =
          await Promise.all([
            api.get("/maintenance/my-requests"),
            api.get("/visitors/expected"),
            api.get("/events?filter=Upcoming"),
            api.get("/bills/pending"),
            api.get("/announcements/recent"),
          ]);

        const pending = maintenanceRes.data.filter((m) => m.status !== "Completed").length;
        setPendingMaintenance(pending);

        setVisitorsToday(expectedVisitorsRes.data.length);

        setUpcomingEventsCount(eventsRes.data.length);
        setUpcomingEvents(eventsRes.data.slice(0, 2));

        setBillsDue(pendingBillsRes.data.length);
        const totalDue = pendingBillsRes.data.reduce((sum, b) => sum + b.amount, 0);
        setTotalDueAmount(totalDue);

        setRecentAnnouncements(announcementsRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const tagColorMap = {
    Alert: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
    Notice: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    Event: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
  };

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return t("today");
    if (days === 1) return t("yesterday");
    return `${days} ${t("daysAgo").split(" ").slice(1).join(" ")}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {t("goodMorningName").replace("Rahul", user?.fullName?.split(" ")[0] || "Resident")}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t("todaysHappening")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label={t("pendingMaintenance")}
          value={loading ? "-" : pendingMaintenance}
          subtext=""
          icon={<Wrench size={18} className="text-red-500" />}
          bg="bg-red-50 dark:bg-red-950"
        />
        <StatCard
          label={t("visitorsToday")}
          value={loading ? "-" : visitorsToday}
          subtext=""
          icon={<Users size={18} className="text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          label={t("upcomingEventsLabel")}
          value={loading ? "-" : upcomingEventsCount}
          subtext=""
          icon={<Calendar size={18} className="text-green-500" />}
          bg="bg-green-50 dark:bg-green-950"
        />
        <StatCard
          label={t("billsDue")}
          value={loading ? "-" : billsDue}
          subtext={loading ? "" : `$${totalDueAmount.toFixed(2)}`}
          icon={<DollarSign size={18} className="text-yellow-500" />}
          bg="bg-yellow-50 dark:bg-yellow-950"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t("recentAnnouncements")}</h3>
            <a href="/announcements" className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {t("viewAll")}
            </a>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
            ) : recentAnnouncements.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">No announcements yet</p>
            ) : (
              recentAnnouncements.map((a) => (
                <div key={a._id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColorMap[a.type] || tagColorMap.Notice}`}>
                      {a.type}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatTimeAgo(a.createdAt)}</span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-2">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("upcomingEventsLabel")}</h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">No upcoming events</p>
            ) : (
              upcomingEvents.map((e) => (
                <div key={e._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                    {new Date(e.date).getDate()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{e.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{e.location}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
