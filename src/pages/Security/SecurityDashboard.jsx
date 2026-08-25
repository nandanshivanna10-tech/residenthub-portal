import { useState, useEffect } from "react";
import { Users, UserCheck, Clock, ShieldCheck } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import api from "../../api/axios";

export default function SecurityDashboard() {
  const [expectedVisitors, setExpectedVisitors] = useState([]);
  const [checkedInVisitors, setCheckedInVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expectedRes, checkedInRes] = await Promise.all([
        api.get("/visitors/all?status=Expected"),
        api.get("/visitors/all?status=Checked In"),
      ]);
      setExpectedVisitors(expectedRes.data);
      setCheckedInVisitors(checkedInRes.data);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function formatDateTime(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Security Overview</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Today's gate activity and visitor status</p>

      {error ? (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Expected Visitors"
          value={loading ? "-" : expectedVisitors.length}
          subtext="Awaiting arrival"
          icon={<Clock size={18} className="text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          label="Currently Checked In"
          value={loading ? "-" : checkedInVisitors.length}
          subtext="Inside the community"
          icon={<UserCheck size={18} className="text-green-500" />}
          bg="bg-green-50 dark:bg-green-950"
        />
        <StatCard
          label="Total Gate Activity"
          value={loading ? "-" : expectedVisitors.length + checkedInVisitors.length}
          subtext="Active passes today"
          icon={<Users size={18} className="text-purple-500" />}
          bg="bg-purple-50 dark:bg-purple-950"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Expected Visitors</h3>
          {loading ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
          ) : null}
          {!loading && expectedVisitors.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No expected visitors right now</p>
          ) : null}
          {!loading && expectedVisitors.length > 0 ? (
            <div className="space-y-3">
              {expectedVisitors.map(function (v) {
                return (
                  <div key={v._id} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-3 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{v.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Visiting {v.user ? v.user.fullName : "Unknown"} ({v.user ? v.user.tower : ""} {v.user && v.user.unit ? "- " + v.user.unit : ""})
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {formatDateTime(v.expectedAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Currently Inside</h3>
          {loading ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
          ) : null}
          {!loading && checkedInVisitors.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No visitors currently checked in</p>
          ) : null}
          {!loading && checkedInVisitors.length > 0 ? (
            <div className="space-y-3">
              {checkedInVisitors.map(function (v) {
                return (
                  <div key={v._id} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-3 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{v.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Visiting {v.user ? v.user.fullName : "Unknown"} ({v.user ? v.user.tower : ""} {v.user && v.user.unit ? "- " + v.user.unit : ""})
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 whitespace-nowrap">
                      Since {formatDateTime(v.checkInTime)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mt-6 flex items-center gap-3 transition-colors">
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
          <ShieldCheck size={20} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Gate Security Active</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Use the Visitors tab to scan QR passes or manually check visitors in and out
          </p>
        </div>
      </div>
    </div>
  );
}
