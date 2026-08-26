import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { t } = useLanguage();
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("personalInfo");
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [parkingSlot, setParkingSlot] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        api.get("/profile"),
        api.get("/profile/stats"),
      ]);
      const p = profileRes.data;
      setFullName(p.fullName || "");
      setEmail(p.email || "");
      setPhone(p.phone || "");
      setEmergencyContact(p.emergencyContact || "");
      setVehicleNumber(p.vehicleNumber || "");
      setParkingSlot(p.parkingSlot || "");
      setProfilePicture(p.profilePicture || "");
      setLastUpdated(p.updatedAt);
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const tabs = [
    { key: "personalInfo", label: t("personalInfo") },
    { key: "security", label: t("security") },
    { key: "notifications", label: t("notifications") },
    { key: "preferences", label: t("preferences") },
  ];

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.put("/profile", {
        fullName,
        email,
        phone,
        emergencyContact,
        vehicleNumber,
        parkingSlot,
      });
      setLastUpdated(res.data.updatedAt);
      setSuccess("Profile updated successfully");

      const updatedUser = { ...user, fullName: res.data.fullName, email: res.data.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setUploadingPic(true);
      setError("");
      setSuccess("");
      try {
        const res = await api.put("/profile/picture", { profilePicture: base64String });
        setProfilePicture(res.data.profilePicture);
        setSuccess("Profile picture updated");

        const updatedUser = { ...user, profilePicture: res.data.profilePicture };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to upload profile picture");
      } finally {
        setUploadingPic(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("myProfile")}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{t("myProfileSubtitle")}</p>

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
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center h-fit transition-colors">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-2xl font-semibold text-blue-600 dark:text-blue-400 mx-auto mb-3">
              {fullName.charAt(0) || "?"}
            </div>
          )}
          <p className="font-semibold text-gray-900 dark:text-gray-100">{fullName}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {user?.tower} {user?.unit ? `- ${user.unit}` : ""}
          </p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-medium">
            {user?.status === "owner" ? t("owner") : t("tenant")}
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handlePictureClick}
            disabled={uploadingPic}
            className="w-full mt-4 border border-gray-200 dark:border-gray-700 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-60"
          >
            {uploadingPic ? "Uploading..." : t("editProfilePicture")}
          </button>

          {stats && (
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Maintenance Requests</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{stats.maintenanceRequestsRaised}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Visitors Pre-registered</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{stats.visitorsPreRegistered}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Events Attended</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{stats.communityEventsAttended}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Bills Paid</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{stats.billsFullyPaid}</span>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setActiveTab(tb.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                  activeTab === tb.key
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {activeTab === "personalInfo" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("fullName")}</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("emailAddress")}</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("phoneNumberLabel2")}</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("emergencyContact")}</label>
                  <input
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("vehicleNumber")}</label>
                  <input
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("parkingSlot")}</label>
                  <input
                    value={parkingSlot}
                    onChange={(e) => setParkingSlot(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {t("lastUpdated")}:{" "}
                  {lastUpdated
                    ? new Date(lastUpdated).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "-"}
                </p>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {saving ? "..." : t("saveChanges")}
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
