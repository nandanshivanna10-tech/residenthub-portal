import { useState, useEffect } from "react";
import { Users, UserCheck, Clock } from "lucide-react";
import api from "../../api/axios";

export default function SecurityDashboard() {
  const [expectedCount, setExpectedCount] = useState(0);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expectedRes, historyRes] = await Promise.all([
        api.get("/visitors/security/expected"),
        api.get("/visitors/security/history"),
      ]);
      setExpectedCount(expectedRes.data.length);
      const checkedIn = historyRes.data.filter((v) => v.status === "Checked In");
      setCheckedInCount(checkedIn.length);
      setRecentActivity(historyRes.data.slice(0, 5));
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Security Dashboard</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Today's expected visitors and gate activity</p>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Expected Visitors</p>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
              <Users size={18} className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {loading ? "-" : expectedCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Currently Inside</p>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
              <UserCheck size={18} className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {loading ? "-" : checkedInCount}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
        ) : recentActivity.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((v) => (
              <div key={v._id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{v.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Visiting: {v.user?.fullName} ({v.user?.tower}-{v.user?.unit})
                  </p>
                </div>
                <span
                  className={
                    v.status === "Checked In"
                      ? "text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                      : "text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                  }
                >
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
