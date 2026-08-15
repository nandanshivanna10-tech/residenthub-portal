import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";

const categoryKeyMap = {
  Plumbing: "plumbing",
  Electrical: "electrical",
  Carpentry: "carpentry",
  "Appliance Repair": "applianceRepair",
  General: "general",
};

export default function Maintenance() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/maintenance/my-requests");
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !description) return;
    setSubmitting(true);
    try {
      await api.post("/maintenance", { category, description, priority });
      setCategory("");
      setDescription("");
      setPriority("Low");
      setShowForm(false);
      fetchRequests();
    } catch (err) {
      setError("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

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

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3">{t("id")}</th>
                <th className="px-4 py-3">{t("category")}</th>
                <th className="px-4 py-3">{t("description")}</th>
                <th className="px-4 py-3">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                    No maintenance requests yet
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                      #{r._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {t(categoryKeyMap[r.category] || r.category)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.description}</td>
                    <td className="px-4 py-3">
                      <span className="bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
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

          <form onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("category")}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="">{t("selectCategory")}</option>
              <option value="Plumbing">{t("plumbing")}</option>
              <option value="Electrical">{t("electrical")}</option>
              <option value="Carpentry">{t("carpentry")}</option>
              <option value="Appliance Repair">{t("applianceRepair")}</option>
              <option value="General">{t("general")}</option>
            </select>

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("description")}</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">
              {t("urgencyPriority")}
            </label>
            <div className="flex gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
              {[
                { label: t("low"), value: "Low" },
                { label: t("medium"), value: "Medium" },
                { label: t("high"), value: "High" },
              ].map((p) => (
                <label key={p.value} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === p.value}
                    onChange={() => setPriority(p.value)}
                  />
                  {p.label}
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
              >
                {submitting ? "..." : t("submitRequest")}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
