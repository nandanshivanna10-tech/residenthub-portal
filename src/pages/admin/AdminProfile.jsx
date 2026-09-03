import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function AdminProfile() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      setFullName(res.data.fullName || "");
      setEmail(res.data.email || "");
      setPhone(res.data.phone || "");
      setProfilePicture(res.data.profilePicture || "");
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

    if (file.size > 15 * 1024 * 1024) {
      setError("Image must be under 15MB");
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
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Profile</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Manage your admin account information</p>

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
            <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-2xl font-semibold text-purple-600 dark:text-purple-400 mx-auto mb-3">
              {fullName.charAt(0) || "A"}
            </div>
          )}
          <p className="font-semibold text-gray-900 dark:text-gray-100">{fullName}</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 font-medium">
            Admin
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
            {uploadingPic ? "Uploading..." : "Edit Profile Picture"}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
