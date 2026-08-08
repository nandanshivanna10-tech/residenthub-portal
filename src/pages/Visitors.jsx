import { useLanguage } from "../context/LanguageContext";

const expectedVisitors = [
  { name: "Anjali Sharma", relation: "Relation: Family", purpose: "Purpose: Weekend Visit", expected: "Expected: Feb 14, 11:00 AM", avatar: "https://i.pravatar.cc/40?img=5" },
  { name: "Amazon Delivery", relation: "Service: E-Commerce", purpose: "Purpose: Package Dropoff", expected: "Expected: Feb 10, 2:30 PM", avatar: "https://i.pravatar.cc/40?img=15" },
];

const checkInHistory = [
  { name: "Vikram Sen (Interior Designer)", in: "10:15 AM", out: "12:45 PM" },
  { name: "John Doe (Plumbing Contractor)", in: "09:30 AM", out: "11:15 AM" },
  { name: "Aarav Mehta (Guest)", in: "04:30 PM Yesterday", out: "09:00 PM Yesterday" },
];

export default function Visitors() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("visitorManagement")}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t("visitorManagementSubtitle")}</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
          {t("preRegisterVisitor")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t("expectedVisitors")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expectedVisitors.map((v, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={v.avatar} alt={v.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{v.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{v.relation}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{v.purpose}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{v.expected}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 py-1.5 rounded-lg text-xs font-medium">
                      {t("revoke")}
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-xs font-medium">
                      {t("editPass")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 p-4 pb-2">{t("checkInHistory")}</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-2">{t("visitorName")}</th>
                  <th className="px-4 py-2">{t("checkInTime")}</th>
                  <th className="px-4 py-2">{t("checkOutTime")}</th>
                  <th className="px-4 py-2">{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {checkInHistory.map((h, i) => (
                  <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{h.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{h.in}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{h.out}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        {t("checkedOut")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-fit transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t("preRegistrationForm")}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{t("preRegistrationFormSubtitle")}</p>

          <div className="space-y-3">
            {[
              { label: t("visitorFullName"), placeholder: "e.g., Harish Kumar" },
              { label: t("phoneNumber"), placeholder: "e.g., +91 9876543210" },
              { label: t("visitPurpose"), placeholder: "e.g., Dinner Guest, Delivery, Service" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</label>
                <input
                  placeholder={f.placeholder}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("expectedDateTime")}</label>
              <input
                type="datetime-local"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("vehicleNumberOptional")}</label>
              <input
                placeholder="e.g., MH-12-AB-1234"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium mt-2">
              {t("generateInviteQrPass")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
