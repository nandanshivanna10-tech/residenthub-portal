import { useState } from "react";
import { Phone, MessageSquare } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const residents = [
  { name: "Priya Patel", unit: "A-201", tower: "Tower A", contact: "+91 98234 56711", moveIn: "Jan 10, 2024", status: "Tenant", email: "priya.patel@gmail.com", emergency: "Dev Patel (Father)", vehicle: "MH-12-PQ-9080 (Skoda Kushaq)", avatar: "https://i.pravatar.cc/80?img=25" },
  { name: "Rahul Sharma", unit: "B-402", tower: "Tower B", contact: "+91 91234 56789", moveIn: "Aug 15, 2023", status: "Owner", email: "rahul.sharma@gmail.com", emergency: "Dev Sharma (Brother)", vehicle: "MH-12-AB-1234", avatar: "https://i.pravatar.cc/80?img=12" },
  { name: "Vikram Sen", unit: "C-105", tower: "Tower C", contact: "+91 93456 78912", moveIn: "Nov 05, 2022", status: "Owner", email: "vikram.sen@gmail.com", emergency: "Not specified", vehicle: "Not specified", avatar: "https://i.pravatar.cc/80?img=33" },
  { name: "Anjali Gupta", unit: "B-308", tower: "Tower B", contact: "+91 94567 89012", moveIn: "May 12, 2025", status: "Tenant", email: "anjali.gupta@gmail.com", emergency: "Not specified", vehicle: "Not specified", avatar: "https://i.pravatar.cc/80?img=45" },
  { name: "Amit Kumar", unit: "A-502", tower: "Tower A", contact: "+91 95678 90123", moveIn: "Dec 20, 2023", status: "Owner", email: "amit.kumar@gmail.com", emergency: "Not specified", vehicle: "Not specified", avatar: "https://i.pravatar.cc/80?img=51" },
];

export default function Directory() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(residents[0]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("residentDirectory")}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{t("residentDirectorySubtitle")}</p>

      <div className="flex justify-between items-center mb-4 gap-3">
        <input
          placeholder={t("searchNameOrUnit")}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        />
        <select className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100">
          <option>{t("blockAll")}</option>
        </select>
      </div>

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
              {residents.map((r, i) => (
                <tr
                  key={i}
                  onClick={() => setSelected(r)}
                  className={`border-t border-gray-100 dark:border-gray-800 cursor-pointer ${
                    selected.name === r.name ? "bg-blue-50 dark:bg-blue-950" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <td className="px-4 py-3 flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                    <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-full object-cover" />
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.unit}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.tower}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.contact}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.moveIn}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.status === "Owner"
                        ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                        : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                    }`}>
                      {r.status === "Owner" ? t("owner") : t("tenant")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-fit transition-colors">
          <div className="flex flex-col items-center text-center mb-4">
            <img src={selected.avatar} alt={selected.name} className="w-16 h-16 rounded-full object-cover mb-2" />
            <p className="font-semibold text-gray-900 dark:text-gray-100">{selected.name}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{selected.tower} - {selected.unit.split("-")[1]}</p>
            <span className="mt-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-medium">
              {selected.status === "Owner" ? t("owner") : t("tenant")}
            </span>
          </div>

          <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">{t("residentDetails")}</p>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t("phoneNumberLabel")}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{selected.contact}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t("emailAddress")}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{selected.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t("emergencyContactName")}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{selected.emergency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t("vehicleRegistered")}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{selected.vehicle}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button className="flex-1 flex items-center justify-center gap-1 border border-gray-200 dark:border-gray-700 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300">
              <Phone size={14} /> {t("call")}
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
              <MessageSquare size={14} /> {t("message")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
