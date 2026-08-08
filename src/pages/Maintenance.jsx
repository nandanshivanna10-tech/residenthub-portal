import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const initialRequests = [
  { id: "#REQ-1049", categoryKey: "plumbing", desc: "Severe water leakage in the master bedroom washroom pipe." },
  { id: "#REQ-1042", categoryKey: "electrical", desc: "Short circuit triggered in the main hallway circuit breaker." },
  { id: "#REQ-1038", categoryKey: "carpentry", desc: "Kitchen cabinet door hinge broken and needs replacement." },
  { id: "#REQ-1021", categoryKey: "applianceRepair", desc: "Community intercom buzzer volume too low, unable to hear." },
];

export default function Maintenance() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [requests] = useState(initialRequests);

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("maintenanceTitle")}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{t("maintenanceSubtitle")}</p>

        <div className="flex gap-3 mb-4">
          <input
            placeholder={t("searchRequest")}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            {t("newRequest")}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3">{t("id")}</th>
                <th className="px-4 py-3">{t("category")}</th>
                <th className="px-4 py-3">{t("description")}</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{r.id}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t(r.categoryKey)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="w-80 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-fit transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t("submitNewRequest")}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400">✕</button>
          </div>

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("category")}</label>
          <select className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100">
            <option>{t("selectCategory")}</option>
            <option>{t("plumbing")}</option>
            <option>{t("electrical")}</option>
            <option>{t("carpentry")}</option>
            <option>{t("applianceRepair")}</option>
            <option>{t("general")}</option>
          </select>

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("description")}</label>
          <textarea
            rows={4}
            className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
          />

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">
            {t("urgencyPriority")}
          </label>
          <div className="flex gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
            {[t("low"), t("medium"), t("high")].map((p, i) => (
              <label key={p} className="flex items-center gap-1">
                <input type="radio" name="priority" defaultChecked={i === 0} />
                {p}
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
              {t("submitRequest")}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
