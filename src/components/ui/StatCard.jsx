export default function StatCard({ label, value, subtext, icon, bg }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>
      </div>
    </div>
  );
}
