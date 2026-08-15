import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, Calendar as CalendarIcon, Download } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";
import api from "../api/axios";

export default function Bills() {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();

  const [summary, setSummary] = useState({
    totalDue: 0,
    nextDueDate: null,
    lastPaymentAmount: 0,
    lastPaymentDate: null,
  });
  const [pendingBills, setPendingBills] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, pendingRes, historyRes] = await Promise.all([
        api.get("/bills/summary"),
        api.get("/bills/pending"),
        api.get("/bills/history"),
      ]);
      setSummary(summaryRes.data);
      setPendingBills(pendingRes.data);
      setPaymentHistory(historyRes.data);
    } catch (err) {
      setError("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      await api.patch(`/bills/${id}/pay`);
      fetchData();
    } catch (err) {
      setError("Failed to process payment");
    } finally {
      setPayingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("billPayments")}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{t("billPaymentsSubtitle")}</p>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("totalDue")}</p>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
              <CreditCard size={18} className="text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {loading ? "-" : formatAmount(summary.totalDue)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("dueDate")}: {formatDate(summary.nextDueDate)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("lastPayment")}</p>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
              <CheckCircle size={18} className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {loading ? "-" : formatAmount(summary.lastPaymentAmount)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("paidOn")} {formatDate(summary.lastPaymentDate)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("nextBillCycle")}</p>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
              <CalendarIcon size={18} className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">Monthly</p>
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
            {pendingBills.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  No pending bills
                </td>
              </tr>
            ) : (
              pendingBills.map((b) => (
                <tr key={b._id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{b.type}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatAmount(b.amount)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(b.dueDate)}</td>
                  <td className="px-4 py-3">
                    <span className="bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium">
                      {t("unpaid")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handlePay(b._id)}
                      disabled={payingId === b._id}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-60"
                    >
                      {payingId === b._id ? "..." : t("payNow")}
                    </button>
                  </td>
                </tr>
              ))
            )}
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
            {paymentHistory.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  No payment history yet
                </td>
              </tr>
            ) : (
              paymentHistory.map((p) => (
                <tr key={p._id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{p.type}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.transactionId}</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400 font-medium">{formatAmount(p.amount)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(p.paidOn)}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 dark:text-blue-400">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
