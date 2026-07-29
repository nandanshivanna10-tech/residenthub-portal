import { useState } from "react";

const familyMembers = [
  { name: "Sunita Sharma", relation: "Mother", avatar: "https://i.pravatar.cc/40?img=47" },
  { name: "Aman Sharma", relation: "Brother", avatar: "https://i.pravatar.cc/40?img=14" },
];

const tabs = ["Personal Info", "Security", "Notifications", "Preferences"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Personal Info");

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
      <p className="text-gray-500 mb-4">Manage your personal information and account settings</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center h-fit">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="Rahul Sharma"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
          />
          <p className="font-semibold text-gray-900">Rahul Sharma</p>
          <p className="text-sm text-gray-400">Tower B - 402</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
            Owner
          </span>
          <p className="text-xs text-gray-400 mt-2">Member since August 2023</p>
          <button className="w-full mt-4 border border-gray-200 py-2 rounded-lg text-sm font-medium text-gray-600">
            Edit Profile Picture
          </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex gap-2 mb-6 border-b border-gray-100 pb-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                  activeTab === t
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === "Personal Info" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    defaultValue="Rahul Sharma"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    defaultValue="rahul.sharma@gmail.com"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    defaultValue="+91 91234 56789"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                  <input
                    defaultValue="Dev Sharma (+91 98765 43210)"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Vehicle Number</label>
                  <input
                    defaultValue="MH-12-AB-1234"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Parking Slot</label>
                  <input
                    defaultValue="B-402-P1 (Basement 1)"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Family Members</p>
                <div className="space-y-2">
                  {familyMembers.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <img src={f.avatar} alt={f.name} className="w-8 h-8 rounded-full object-cover" />
                        <p className="text-sm font-medium text-gray-800">{f.name}</p>
                      </div>
                      <span className="text-xs text-gray-400">{f.relation}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">Last updated: Today at 9:02 AM</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeTab !== "Personal Info" && (
            <p className="text-sm text-gray-400">This section is coming soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
