import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";

export default function Visitors() {
  const { t } = useLanguage();
  const [expectedVisitors, setExpectedVisitors] = useState([]);
  const [checkInHistory, setCheckInHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [expectedAt, setExpectedAt] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingVisitor, setEditingVisitor] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPurpose, setEditPurpose] = useState("");
  const [editExpectedAt, setEditExpectedAt] = useState("");
  const [editVehicleNumber, setEditVehicleNumber] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [qrVisitor, setQrVisitor] = useState(null);
  const qrRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expectedRes, historyRes] = await Promise.all([
        api.get("/visitors/expected"),
        api.get("/visitors/history"),
      ]);
      setExpectedVisitors(expectedRes.data);
      setCheckInHistory(historyRes.data);
    } catch (err) {
      setError("Failed to load visitor data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !expectedAt) return;
    setSubmitting(true);
    try {
      const res = await api.post("/visitors", { name, phone, purpose, expectedAt, vehicleNumber });
      setName("");
      setPhone("");
      setPurpose("");
      setExpectedAt("");
      setVehicleNumber("");
      fetchData();
      setQrVisitor(res.data);
    } catch (err) {
      setError("Failed to pre-register visitor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await api.patch(`/visitors/${id}/revoke`);
      fetchData();
    } catch (err) {
      setError("Failed to revoke pass");
    }
  };

  const openEditModal = (visitor) => {
    setEditingVisitor(visitor);
    setEditName(visitor.name || "");
    setEditPhone(visitor.phone || "");
    setEditPurpose(visitor.purpose || "");
    setEditExpectedAt(visitor.expectedAt ? visitor.expectedAt.slice(0, 16) : "");
    setEditVehicleNumber(visitor.vehicleNumber || "");
  };

  const closeEditModal = () => {
    setEditingVisitor(null);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editingVisitor) return;
    setSavingEdit(true);
    try {
      await api.put(`/visitors/${editingVisitor._id}`, {
        name: editName,
        phone: editPhone,
        purpose: editPurpose,
        expectedAt: editExpectedAt,
        vehicleNumber: editVehicleNumber,
      });
      closeEditModal();
      fetchData();
    } catch (err) {
      setError("Failed to update visitor");
    } finally {
      setSavingEdit(false);
    }
  };

  const downloadQrCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `visitor-pass-${qrVisitor?.name?.replace(/\s+/g, "-") || "pass"}.png`;
    link.click();
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("visitorManagement")}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t("visitorManagementSubtitle")}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t("expectedVisitors")}</h3>
            {loading ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
            ) : expectedVisitors.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">No expected visitors</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {expectedVisitors.map((v) => (
                  <div key={v._id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                        {v.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{v.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{v.phone}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Purpose: {v.purpose}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Expected: {formatDateTime(v.expectedAt)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setQrVisitor(v)}
                        className="flex-1 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 py-1.5 rounded-lg text-xs font-medium"
                      >
                        View QR
                      </button>
                      <button
                        onClick={() => handleRevoke(v._id)}
                        className="flex-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 py-1.5 rounded-lg text-xs font-medium"
                      >
                        {t("revoke")}
                      </button>
                      <button
                        onClick={() => openEditModal(v)}
                        className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-xs font-medium"
                      >
                        {t("editPass")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                {checkInHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                      No check-in history yet
                    </td>
                  </tr>
                ) : (
                  checkInHistory.map((h) => (
                    <tr key={h._id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{h.name}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDateTime(h.checkInTime)}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDateTime(h.checkOutTime)}</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-fit transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t("preRegistrationForm")}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{t("preRegistrationFormSubtitle")}</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("visitorFullName")}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Harish Kumar"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("phoneNumber")}</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +91 9876543210"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("visitPurpose")}</label>
              <input
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Dinner Guest, Delivery, Service"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("expectedDateTime")}</label>
              <input
                type="datetime-local"
                value={expectedAt}
                onChange={(e) => setExpectedAt(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("vehicleNumberOptional")}</label>
              <input
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g., MH-12-AB-1234"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium mt-2 disabled:opacity-60"
            >
              {submitting ? "..." : t("generateInviteQrPass")}
            </button>
          </form>
        </div>
      </div>

      {editingVisitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t("editPass")}</h3>
              <button onClick={closeEditModal} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("visitorFullName")}</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("phoneNumber")}</label>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("visitPurpose")}</label>
                <input
                  value={editPurpose}
                  onChange={(e) => setEditPurpose(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("expectedDateTime")}</label>
                <input
                  type="datetime-local"
                  value={editExpectedAt}
                  onChange={(e) => setEditExpectedAt(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("vehicleNumberOptional")}</label>
                <input
                  value={editVehicleNumber}
                  onChange={(e) => setEditVehicleNumber(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {savingEdit ? "..." : t("saveChanges")}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrVisitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Visitor QR Pass</h3>
              <button onClick={() => setQrVisitor(null)} className="text-gray-400">✕</button>
            </div>

            <div ref={qrRef} className="flex justify-center mb-4 bg-white p-4 rounded-lg">
              <QRCodeCanvas value={qrVisitor._id} size={200} />
            </div>

            <p className="font-medium text-gray-900 dark:text-gray-100">{qrVisitor.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Show this QR code to security at the gate
            </p>

            <button
              onClick={downloadQrCode}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium"
            >
              <Download size={16} /> Download QR Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
