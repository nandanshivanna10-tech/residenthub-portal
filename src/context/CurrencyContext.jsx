import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

const rates = {
  USD: { symbol: "$", rate: 1, label: "USD ($)" },
  INR: { symbol: "₹", rate: 83, label: "INR (₹)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
  AED: { symbol: "د.إ", rate: 3.67, label: "AED (د.إ)" },
};

export const currencyList = Object.keys(rates);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "USD");

  const changeCurrency = (code) => {
    setCurrency(code);
    localStorage.setItem("currency", code);
  };

  const formatAmount = (usdAmount) => {
    const { symbol, rate } = rates[currency];
    const converted = usdAmount * rate;
    const formatted =
      currency === "INR"
        ? converted.toLocaleString("en-IN", { maximumFractionDigits: 0 })
        : converted.toFixed(2);
    return `${symbol}${formatted}`;
  };

  const currencyLabel = (code) => rates[code]?.label || code;

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, formatAmount, currencyLabel }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
