import { useState } from "react";

const initialRequests = [
  { id: "#REQ-1049", category: "Plumbing", desc: "Severe water leakage in the master bedroom washroom pipe." },
  { id: "#REQ-1042", category: "Electrical", desc: "Short circuit triggered in the main hallway circuit breaker." },
  { id: "#REQ-1038", category: "Carpentry", desc: "Kitchen cabinet door hinge broken and needs replacement." },
  { id: "#REQ-1021", category: "Appliance Repair", desc: "Community intercom buzzer volume too low, unable to hear." },
];

export default function Maintenance() {
  const [showForm, setShowForm] = useState(false);
  const [requests] = useState(initialRequests);

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900">Maintenance Requests</h2>
        <p className="text-gray-500 mb-4">Raise and monitor support requests for your apartment</p>

        <div className="flex gap-3 mb-4">
          <input
            placeholder="Search request..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + New Request
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.id}</td>
                  <td className="px-4 py-3">{r.category}</td>
                  <td className="px-4 py-3 text-gray-500">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="w-80 bg-white rounded-xl border border-gray-200 p-5 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Submit New Request</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400">✕</button>
          </div>

          <label className="text-sm font-medium text-gray-700">Category</label>
          <select className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
            <option>Select Category</option>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Carpentry</option>
            <option>Appliance Repair</option>
            <option>General</option>

          </select>

          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            placeholder="Provide specific details of the issue..."
            className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
          />

          <label className="text-sm font-medium text-gray-700">Upload Image Evidence (Optional)</label>
          <div className="mt-1 mb-3 border-2 border-dashed border-gray-200 rounded-lg py-6 text-center text-sm text-blue-600 cursor-pointer">
            Click to upload photo
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
          </div>

          <label className="text-sm font-medium text-gray-700">Select Urgency Priority</label>
          <div className="flex gap-4 mt-2 mb-4 text-sm text-gray-600">
            {["Low", "Medium", "High"].map((p) => (
              <label key={p} className="flex items-center gap-1">
                <input type="radio" name="priority" defaultChecked={p === "Low"} />
                {p}
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
              Submit Request
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
