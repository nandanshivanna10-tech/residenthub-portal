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
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    currency === code ? "text-blue-600 font-medium" : "text-gray-700 dark:text-gray-200"
                  }`}
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
              {languageList.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => {
                    changeLanguage(code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    lang === code ? "text-blue-600 font-medium" : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="relative">
          <Bell size={20} className="text-gray-500 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">
              {user?.fullName || "Resident"}
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
