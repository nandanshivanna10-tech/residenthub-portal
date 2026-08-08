import { Wrench, Users, Calendar, DollarSign } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import { useLanguage } from "../context/LanguageContext";

export default function Dashboard() {
  const { t } = useLanguage();

  const announcements = [
    {
      tag: t("alertTag"),
      tagColor: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
      title: t("fireSafetyTitle"),
      desc: t("fireSafetyDesc"),
      time: t("today"),
    },
    {
      tag: t("noticeTag"),
      tagColor: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
      title: t("gymUpgradeTitle"),
      desc: t("gymUpgradeDesc"),
      time: t("yesterday"),
    },
    {
      tag: t("eventTag"),
      tagColor: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
      title: t("ttTournamentTitle"),
      desc: t("ttTournamentDesc"),
      time: t("daysAgo"),
    },
  ];

  const events = [
    { date: "12", label: t("ttTournamentLabel"), time: t("clubhouseTime"), color: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400" },
    { date: "19", label: t("securityCommitteeLabel"), time: t("confRoomTime"), color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("goodMorningName")}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t("todaysHappening")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label={t("pendingMaintenance")}
          value="3"
          subtext={t("inProgress")}
          icon={<Wrench size={18} className="text-red-500" />}
          bg="bg-red-50 dark:bg-red-950"
        />
        <StatCard
          label={t("visitorsToday")}
          value="5"
          subtext={t("nextExpected")}
          icon={<Users size={18} className="text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          label={t("upcomingEventsLabel")}
          value="2"
          subtext={t("clubhouseMeetingTonight")}
          icon={<Calendar size={18} className="text-green-500" />}
          bg="bg-green-50 dark:bg-green-950"
        />
        <StatCard
          label={t("billsDue")}
          value="1"
          subtext={t("dueInDays")}
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
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("upcomingEventsLabel")}</h3>
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
