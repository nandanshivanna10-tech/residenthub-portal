import { Search, Bell, Sun, Moon, Globe, Wallet, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage, languageList } from "../../context/LanguageContext";
import { useCurrency, currencyList } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ title }) {
  const { darkMode, toggleTheme } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();
  const { currency, changeCurrency, currencyLabel } = useCurrency();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

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
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300"
            title="Notifications"
          >
            <Bell size={20} />
          </button>
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
              </div>
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">No new notifications</p>
              </div>
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
