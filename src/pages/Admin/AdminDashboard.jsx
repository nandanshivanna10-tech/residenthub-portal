import { useState, useEffect } from "react";
import { Wrench, Users, Calendar, DollarSign, Building2 } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import { useCurrency } from "../../context/CurrencyContext";
import api from "../../api/axios";

const statusColorMap = {
  Pending: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400",
  "In Progress": "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  Completed: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
};

export default function AdminDashboard() {
  const { formatAmount } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/admin");
        setData(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Overview</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Community-wide activity across all residents</p>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          label="Total Residents"
          value={loading ? "-" : data?.totalResidents}
          subtext=""
          icon={<Building2 size={18} className="text-purple-500" />}
          bg="bg-purple-50 dark:bg-purple-950"
        />
        <StatCard
          label="Pending Maintenance"
          value={loading ? "-" : data?.pendingMaintenanceCount}
          subtext={loading ? "" : `${data?.inProgressMaintenanceCount} in progress`}
          icon={<Wrench size={18} className="text-red-500" />}
          bg="bg-red-50 dark:bg-red-950"
        />
        <StatCard
          label="Expected Visitors"
          value={loading ? "-" : data?.expectedVisitorsCount}
          subtext={loading ? "" : `${data?.checkedInVisitorsCount} checked in`}
          icon={<Users size={18} className="text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          label="Upcoming Events"
          value={loading ? "-" : data?.upcomingEventsCount}
          subtext=""
          icon={<Calendar size={18} className="text-green-500" />}
          bg="bg-green-50 dark:bg-green-950"
        />
        <StatCard
          label="Unpaid Bills"
          value={loading ? "-" : data?.unpaidBillsCount}
          subtext={loading ? "" : formatAmount(data?.totalOutstandingAmount || 0)}
          icon={<DollarSign size={18} className="text-yellow-500" />}
          bg="bg-yellow-50 dark:bg-yellow-950"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Maintenance Requests</h3>
          {loading ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
          ) : data?.recentMaintenance?.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No requests yet</p>
          ) : (
            <div className="space-y-3">
              {data?.recentMaintenance?.map((r) => (
                <div key={r._id} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-3 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{r.category}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {r.user?.fullName} · {r.user?.tower} {r.user?.unit ? `- ${r.user.unit}` : ""}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColorMap[r.status] || statusColorMap.Pending}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Visitors</h3>
          {loading ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
          ) : data?.recentVisitors?.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No visitors yet</p>
          ) : (
            <div className="space-y-3">
              {data?.recentVisitors?.map((v) => (
                <div key={v._id} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-3 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{v.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Visiting {v.user?.fullName} · {v.user?.tower} {v.user?.unit ? `- ${v.user.unit}` : ""}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mt-6 transition-colors">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Announcements</h3>
        {loading ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
        ) : data?.recentAnnouncements?.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No announcements yet</p>
        ) : (
          <div className="space-y-3">
            {data?.recentAnnouncements?.map((a) => (
              <div key={a._id} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{a.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{a.type} · Posted by {a.postedBy}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(a.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
