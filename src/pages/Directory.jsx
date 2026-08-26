import { useState, useEffect } from "react";
import { Phone, MessageSquare } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";

export default function Directory() {
  const { t } = useLanguage();
  const [residents, setResidents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [tower, setTower] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDirectory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (tower !== "All") params.append("tower", tower);

      const res = await api.get(`/directory?${params.toString()}`);
      setResidents(res.data);
      if (res.data.length > 0 && !selected) {
        setSelected(res.data[0]);
      }
    } catch (err) {
      setError("Failed to load directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchDirectory();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, tower]);

  const towers = ["All", "Tower A", "Tower B", "Tower C"];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("residentDirectory")}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{t("residentDirectorySubtitle")}</p>

      <div className="flex justify-between items-center mb-4 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchNameOrUnit")}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        />
        <select
          value={tower}
          onChange={(e) => setTower(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        >
          {towers.map((tw) => (
            <option key={tw} value={tw}>
              {tw === "All" ? t("blockAll") : `Block: ${tw}`}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3">{t("residentName")}</th>
                <th className="px-4 py-3">{t("unit")}</th>
                <th className="px-4 py-3">{t("tower")}</th>
                <th className="px-4 py-3">{t("contact")}</th>
                <th className="px-4 py-3">{t("moveInDate")}</th>
                <th className="px-4 py-3">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : residents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                    No residents found
                  </td>
                </tr>
              ) : (
                residents.map((r) => (
                  <tr
                    key={r._id}
                    onClick={() => setSelected(r)}
                    className={`border-t border-gray-100 dark:border-gray-800 cursor-pointer ${
                      selected?._id === r._id ? "bg-blue-50 dark:bg-blue-950" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <td className="px-4 py-3 flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                      {r.profilePicture ? (
                        <img src={r.profilePicture} alt={r.fullName} className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-semibold">
                          {r.fullName.charAt(0)}
                        </div>
                      )}
                      {r.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.unit || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.tower || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.phone || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          r.status === "owner"
                            ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                            : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                        }`}
                      >
                        {r.status === "owner" ? t("owner") : t("tenant")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-fit transition-colors">
          {!selected ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">Select a resident to view details</p>
          ) : (
            <>
              <div className="flex flex-col items-center text-center mb-4">
                {selected.profilePicture ? (
                  <img
                    src={selected.profilePicture}
                    alt={selected.fullName}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    {selected.fullName.charAt(0)}
                  </div>
                )}
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selected.fullName}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {selected.tower} {selected.unit ? `- ${selected.unit}` : ""}
                </p>
                <span className="mt-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-medium">
                  {selected.status === "owner" ? t("owner") : t("tenant")}
                </span>
              </div>

              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">{t("residentDetails")}</p>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t("phoneNumberLabel")}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{selected.phone || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t("emailAddress")}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t("emergencyContactName")}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {selected.emergencyContact || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t("vehicleRegistered")}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {selected.vehicleNumber || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                
                  href={selected.phone ? `tel:${selected.phone}` : undefined}
                  className={`flex-1 flex items-center justify-center gap-1 border border-gray-200 dark:border-gray-700 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 ${
                    !selected.phone ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <Phone size={14} /> {t("call")}
                </a>
                
                  href={selected.email ? `mailto:${selected.email}` : undefined}
                  className={`flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium ${
                    !selected.email ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <MessageSquare size={14} /> {t("message")}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
