const expectedVisitors = [
  {
    name: "Anjali Sharma",
    relation: "Relation: Family",
    purpose: "Purpose: Weekend Visit",
    expected: "Expected: Feb 14, 11:00 AM",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
  {
    name: "Amazon Delivery",
    relation: "Service: E-Commerce",
    purpose: "Purpose: Package Dropoff",
    expected: "Expected: Feb 10, 2:30 PM",
    avatar: "https://i.pravatar.cc/40?img=15",
  },
];

const checkInHistory = [
  { name: "Vikram Sen (Interior Designer)", in: "10:15 AM", out: "12:45 PM", status: "Checked Out" },
  { name: "John Doe (Plumbing Contractor)", in: "09:30 AM", out: "11:15 AM", status: "Checked Out" },
  { name: "Aarav Mehta (Guest)", in: "04:30 PM Yesterday", out: "09:00 PM Yesterday", status: "Checked Out" },
];

export default function Visitors() {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Visitor Management</h2>
          <p className="text-gray-500">Pre-register your personal visitors & monitor past community arrivals</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
          + Pre-Register Visitor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Expected Visitors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expectedVisitors.map((v, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={v.avatar} alt={v.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{v.name}</p>
                      <p className="text-xs text-gray-400">{v.relation}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{v.purpose}</p>
                  <p className="text-sm text-gray-500 mb-3">{v.expected}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg text-xs font-medium">
                      Revoke
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-xs font-medium">
                      Edit Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <h3 className="font-semibold text-gray-900 p-4 pb-2">Check-in History</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-2">Visitor Name</th>
                  <th className="px-4 py-2">Check-in Time</th>
                  <th className="px-4 py-2">Check-out Time</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {checkInHistory.map((h, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-800">{h.name}</td>
                    <td className="px-4 py-3 text-gray-500">{h.in}</td>
                    <td className="px-4 py-3 text-gray-500">{h.out}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 h-fit">
          <h3 className="font-semibold text-gray-900 mb-1">Pre-Registration Form</h3>
          <p className="text-xs text-gray-400 mb-4">Quick generate visitor access passes</p>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Visitor Full Name</label>
              <input
                placeholder="e.g., Harish Kumar"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                placeholder="e.g., +91 9876543210"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Visit Purpose</label>
              <input
                placeholder="e.g., Dinner Guest, Delivery, Service"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Expected Date & Time</label>
              <input
                type="datetime-local"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Vehicle Number (Optional)</label>
              <input
                placeholder="e.g., MH-12-AB-1234"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium mt-2">
              Generate Invite QR Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
