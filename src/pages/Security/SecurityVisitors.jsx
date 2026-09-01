import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import api from "../../api/axios";

export default function SecurityVisitors() {
  const [expectedVisitors, setExpectedVisitors] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [scanning, setScanning] = useState(false);
  const [scannedVisitor, setScannedVisitor] = useState(null);
  const scannerRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expectedRes, historyRes] = await Promise.all([
        api.get("/visitors/security/expected"),
        api.get("/visitors/security/history"),
      ]);
      setExpectedVisitors(expectedRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError("Failed to load visitor data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        async (decodedText) => {
          scanner.clear();
          setScanning(false);
          await handleScanResult(decodedText);
        },
        (err) => {}
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [scanning]);

  const handleScanResult = async (qrCode) => {
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/visitors/scan", { qrCode });
      setScannedVisitor(res.data.visitor);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid QR code");
      setScannedVisitor(null);
    }
  };

  const handleCheckIn = async () => {
    if (!scannedVisitor) return;
    try {
      await api.patch("/visitors/" + scannedVisitor._id + "/check-in");
      setSuccess(scannedVisitor.name + " checked in successfully");
      setScannedVisitor(null);
      fetchData();
    } catch (err) {
      setError("Failed to check in visitor");
    }
  };

  const handleCheckOut = async (id, name) => {
    try {
      await api.patch("/visitors/" + id + "/check-out");
      setSuccess(name + " checked out successfully");
      fetchData();
    } catch (err) {
      setError("Failed to check out visitor");
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Visitor Check-In</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Scan visitor QR passes to check them in or out</p>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-fit">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">QR Scanner</h3>

          {!scanning && !scannedVisitor && (
            <button
              onClick={() => setScanning(true)}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg text-sm font-medium"
            >
              <Camera size={18} /> Start Scanning
            </button>
          )}

          {scanning && (
            <div>
              <div id="qr-reader" className="w-full"></div>
              <button
                onClick={() => setScanning(false)}
                className="w-full mt-3 border border-gray-200 dark:border-gray-700 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
            </div>
          )}

          {scannedVisitor && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={20} className="text-green-500" />
                <p className="font-medium text-gray-900 dark:text-gray-100">Valid Pass Found</p>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">{scannedVisitor.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Visiting: {scannedVisitor.user?.fullName} ({scannedVisitor.user?.tower} - {scannedVisitor.user?.unit})
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Purpose: {scannedVisitor.purpose}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCheckIn}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium"
                >
                  Confirm Check-In
                </button>
                <button
                  onClick={() => setScannedVisitor(null)}
                  className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 p-4 pb-2">Expected Today</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-2">Visitor</th>
                  <th className="px-4 py-2">Visiting</th>
                  <th className="px-4 py-2">Expected</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : expectedVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                      No visitors expected
                    </td>
                  </tr>
                ) : (
                  expectedVisitors.map((v) => (
                    <tr key={v._id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{v.name}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {v.user?.fullName} ({v.user?.tower}-{v.user?.unit})
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDateTime(v.expectedAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setScannedVisitor(v)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          Check In
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 p-4 pb-2">Recent Activity</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-2">Visitor</th>
                  <th className="px-4 py-2">Check-in</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                      No recent activity
                    </td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr key={h._id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{h.name}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDateTime(h.checkInTime)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            h.status === "Checked In"
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium"
                              : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium"
                          }
                        >
                          {h.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {h.status === "Checked In" && (
                          <button
                            onClick={() => handleCheckOut(h._id, h.name)}
                            className="text-orange-600 dark:text-orange-400 text-xs font-medium"
                          >
                            Check Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
