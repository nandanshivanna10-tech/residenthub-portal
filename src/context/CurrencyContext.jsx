import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

const rates = {
  INR: { symbol: "₹", rate: 1, label: "INR (₹)" },
  USD: { symbol: "$", rate: 0.012, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.011, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.0095, label: "GBP (£)" },
  AED: { symbol: "د.إ", rate: 0.044, label: "AED (د.إ)" },
};

export const currencyList = Object.keys(rates);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "INR");

  const changeCurrency = (code) => {
    setCurrency(code);
    localStorage.setItem("currency", code);
  };

  const formatAmount = (inrAmount) => {
    const { symbol, rate } = rates[currency];
    const converted = inrAmount * rate;
    const formatted =
      currency === "INR"
        ? converted.toLocaleString("en-IN", { maximumFractionDigits: 0 })
        : converted.toFixed(2);
    return symbol + formatted;
  };

  const currencyLabel = (code) => (rates[code] ? rates[code].label : code);

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, formatAmount, currencyLabel }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
