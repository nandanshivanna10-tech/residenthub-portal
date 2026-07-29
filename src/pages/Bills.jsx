import { CreditCard, CheckCircle, Calendar as CalendarIcon, Download } from "lucide-react";

const pendingBills = [
  { type: "Maintenance Fee", amount: "$120.00", due: "Feb 15, 2026", status: "Unpaid" },
  { type: "Water Meter Charge", amount: "$18.50", due: "Feb 15, 2026", status: "Unpaid" },
];

const paymentHistory = [
  { desc: "Maintenance Fee", txn: "TXN-9021489", amount: "$120.00", date: "Jan 12, 2026" },
  { desc: "Clubhouse Venue Booking Deposit", txn: "TXN-8874102", amount: "$250.00", date: "Jan 05, 2026" },
  { desc: "Water Meter Charge", txn: "TXN-8541296", amount: "$22.40", date: "Dec 14, 2025" },
];

export default function Bills() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Bill Payments</h2>
      <p className="text-gray-500 mb-4">
        Clear utility fees, maintenance charges, and access receipt history securely
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500">Total Due</p>
            <div className="p-2 rounded-lg bg-red-50">
              <CreditCard size={18} className="text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$120.00</p>
          <p className="text-xs text-gray-400 mt-1">Due Date: Feb 15, 2026</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500">Last Payment</p>
            <div className="p-2 rounded-lg bg-green-50">
              <CheckCircle size={18} className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$145.00</p>
          <p className="text-xs text-gray-400 mt-1">Paid on Jan 12, 2026</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500">Next Bill Cycle</p>
            <div className="p-2 rounded-lg bg-blue-50">
              <CalendarIcon size={18} className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">March 1</p>
          <p className="text-xs text-gray-400 mt-1">Billing generates monthly</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <h3 className="font-semibold text-gray-900 p-4 pb-2">Pending Bills</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-2">Bill Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingBills.map((b, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">{b.type}</td>
                <td className="px-4 py-3 text-gray-700">{b.amount}</td>
                <td className="px-4 py-3 text-gray-500">{b.due}</td>
                <td className="px-4 py-3">
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                    Pay Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <h3 className="font-semibold text-gray-900 p-4 pb-2">Payment History</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-2">Bill Description</th>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Amount Paid</th>
              <th className="px-4 py-2">Payment Date</th>
              <th className="px-4 py-2">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((p, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">{p.desc}</td>
                <td className="px-4 py-3 text-gray-500">{p.txn}</td>
                <td className="px-4 py-3 text-green-600 font-medium">{p.amount}</td>
                <td className="px-4 py-3 text-gray-500">{p.date}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
