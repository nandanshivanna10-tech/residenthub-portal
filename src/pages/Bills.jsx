import { useCurrency } from "../context/CurrencyContext";
import { CreditCard, CheckCircle, Calendar as CalendarIcon, Download } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const pendingBills = [
  { type: "Maintenance Fee", amount: 120.00, due: "Feb 15, 2026" },
  { type: "Water Meter Charge", amount: 18.50, due: "Feb 15, 2026" },
];

const paymentHistory = [
  { desc: "Maintenance Fee", txn: "TXN-9021489", amount: 120.00, date: "Jan 12, 2026" },
  { desc: "Clubhouse Venue Booking Deposit", txn: "TXN-8874102", amount: 250.00, date: "Jan 05, 2026" },
  { desc: "Water Meter Charge", txn: "TXN-8541296", amount: 22.40, date: "Dec 14, 2025" },
];

export default function Bills() {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("billPayments")}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{t("billPaymentsSubtitle")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("totalDue")}</p>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
              <CreditCard size={18} className="text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatAmount(120.00)}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("dueDate")}: Feb 15, 2026</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("lastPayment")}</p>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
              <CheckCircle size={18} className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatAmount(145.00)}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("paidOn")} Jan 12, 2026</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("nextBillCycle")}</p>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
              <CalendarIcon size={18} className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">March 1</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("billingGeneratesMonthly")}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 transition-colors">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 p-4 pb-2">{t("pendingBills")}</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
            <tr>
              <th className="px-4 py-2">{t("billType")}</th>
              <th className="px-4 py-2">{t("amount")}</th>
              <th className="px-4 py-2">{t("dueDateCol")}</th>
              <th className="px-4 py-2">{t("status")}</th>
              <th className="px-4 py-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {pendingBills.map((b, i) => (
              <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{b.type}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatAmount(b.amount)}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{b.due}</td>
                <td className="px-4 py-3">
                  <span className="bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium">
                    {t("unpaid")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                    {t("payNow")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 p-4 pb-2">{t("paymentHistory")}</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
            <tr>
              <th className="px-4 py-2">{t("billDescription")}</th>
              <th className="px-4 py-2">{t("transactionId")}</th>
              <th className="px-4 py-2">{t("amountPaid")}</th>
              <th className="px-4 py-2">{t("paymentDate")}</th>
              <th className="px-4 py-2">{t("receipt")}</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((p, i) => (
              <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{p.desc}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.txn}</td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400 font-medium">{formatAmount(p.amount)}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.date}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 dark:text-blue-400">
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
