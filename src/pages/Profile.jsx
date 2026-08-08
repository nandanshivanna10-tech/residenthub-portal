import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const familyMembers = [
  { name: "Sunita Sharma", relation: "Mother", avatar: "https://i.pravatar.cc/40?img=47" },
  { name: "Aman Sharma", relation: "Brother", avatar: "https://i.pravatar.cc/40?img=14" },
];

export default function Profile() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("personalInfo");

  const tabs = [
    { key: "personalInfo", label: t("personalInfo") },
    { key: "security", label: t("security") },
    { key: "notifications", label: t("notifications") },
    { key: "preferences", label: t("preferences") },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("myProfile")}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{t("myProfileSubtitle")}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center h-fit transition-colors">
          <img src="https://i.pravatar.cc/100?img=12" alt="Rahul Sharma" className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
          <p className="font-semibold text-gray-900 dark:text-gray-100">Rahul Sharma</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Tower B - 402</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-medium">
            {t("owner")}
          </span>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t("memberSince")} August 2023</p>
          <button className="w-full mt-4 border border-gray-200 dark:border-gray-700 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300">
            {t("editProfilePicture")}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
            {tabs.map((t2) => (
              <button
                key={t2.key}
                onClick={() => setActiveTab(t2.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                  activeTab === t2.key
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t2.label}
              </button>
            ))}
          </div>

          {activeTab === "personalInfo" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: t("fullName"), value: "Rahul Sharma" },
                  { label: t("emailAddress"), value: "rahul.sharma@gmail.com" },
                  { label: t("phoneNumberLabel2"), value: "+91 91234 56789" },
                  { label: t("emergencyContact"), value: "Dev Sharma (+91 98765 43210)" },
                  { label: t("vehicleNumber"), value: "MH-12-AB-1234" },
                  { label: t("parkingSlot"), value: "B-402-P1 (Basement 1)" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</label>
                    <input
                      defaultValue={f.value}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("familyMembers")}</p>
                <div className="space-y-2">
                  {familyMembers.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <img src={f.avatar} alt={f.name} className="w-8 h-8 rounded-full object-cover" />
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{f.name}</p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{f.relation}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">{t("lastUpdated")}: Today at 9:02 AM</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {t("saveChanges")}
                </button>
              </div>
            </>
          )}

          {activeTab !== "personalInfo" && (
            <p className="text-sm text-gray-400 dark:text-gray-500">This section is coming soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
