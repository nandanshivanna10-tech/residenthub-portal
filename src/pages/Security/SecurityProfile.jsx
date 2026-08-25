import { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function SecurityProfile() {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      setFullName(res.data.fullName || "");
      setEmail(res.data.email || "");
      setPhone(res.data.phone || "");
      setProfilePhoto(res.data.profilePhoto || "");
      setLastUpdated(res.data.updatedAt);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.put("/profile", { fullName, email, phone });
      setLastUpdated(res.data.updatedAt);
      setSuccess("Profile updated successfully");

      const updatedUser = Object.assign({}, user, { fullName: res.data.fullName, email: res.data.email });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await api.post("/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfilePhoto(res.data.profilePhoto);
      setSuccess("Profile photo updated");

      const updatedUser = Object.assign({}, user, { profilePhoto: res.data.profilePhoto });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
    } catch (err) {
      setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Profile</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Manage your security account information</p>

      {error ? (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mb-4 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">
          {success}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center h-fit transition-colors">
          <div className="relative w-20 h-20 mx-auto mb-3">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={fullName}
                className="w-20 h-20 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center text-2xl font-semibold text-green-600 dark:text-green-400">
                {fullName ? fullName.charAt(0) : "S"}
              </div>
            )}
            <button
              onClick={function () { fileInputRef.current && fileInputRef.current.click(); }}
              disabled={uploadingPhoto}
              className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-1.5 border-2 border-white dark:border-gray-900 disabled:opacity-60"
              title="Change photo"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          <p className="font-semibold text-gray-900 dark:text-gray-100">{fullName}</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-medium">
            Security
          </span>

          {uploadingPhoto ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Uploading photo...</p>
          ) : null}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                value={fullName}
                onChange={function (e) { setFullName(e.target.value); }}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                value={email}
                onChange={function (e) { setEmail(e.target.value); }}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                value={phone}
                onChange={function (e) { setPhone(e.target.value); }}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Last updated:{" "}
              {lastUpdated
                ? new Date(lastUpdated).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                : "-"}
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saving ? "..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
