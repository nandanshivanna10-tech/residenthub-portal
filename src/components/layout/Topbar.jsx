import { Search, Bell, Sun, Moon, Globe, Wallet, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage, languageList } from "../../context/LanguageContext";
import { useCurrency, currencyList } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Topbar({ title }) {
  const { darkMode, toggleTheme } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();
  const { currency, changeCurrency, currencyLabel } = useCurrency();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch unread count");
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = () => {
    if (!showNotifMenu) {
      fetchNotifications();
    }
    setShowNotifMenu(!showNotifMenu);
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.read) {
      try {
        await api.patch("/notifications/" + notif._id + "/read");
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to mark as read");
      }
    }
    if (notif.link) {
      navigate(notif.link);
      setShowNotifMenu(false);
    }
  };

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return minutes + "m ago";
    if (hours < 24) return hours + "h ago";
    return days + "d ago";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="pl-9 pr-4 py-2 w-64 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1"
            title="Change currency"
          >
            <Wallet size={18} />
            <span className="text-xs font-medium">{currency}</span>
          </button>
          {showCurrencyMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {currencyList.map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    changeCurrency(code);
                    setShowCurrencyMenu(false);
                  }}
                  className={
                    currency === code
                      ? "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 font-medium"
                      : "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }
                >
                  {currencyLabel(code)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1"
            title="Change language"
          >
            <Globe size={18} />
            <span className="text-xs font-medium uppercase">{lang}</span>
          </button>
          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {languageList.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    changeLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  className={
                    lang === l.code
                      ? "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 font-medium"
                      : "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={handleBellClick}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 dark:text-blue-400 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-400 dark:text-gray-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif._id}
                    onClick={() => handleNotifClick(notif)}
                    className={
                      notif.read
                        ? "w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700"
                        : "w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 bg-blue-50 dark:bg-blue-950"
                    }
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notif.title}</p>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user && user.profilePicture ? (
            <img src={user.profilePicture} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400">
              {user && user.fullName ? user.fullName.charAt(0) : "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">
              {user && user.fullName ? user.fullName : "Resident"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{t("residentAccount")}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
