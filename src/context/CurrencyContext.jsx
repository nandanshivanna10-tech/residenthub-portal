import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

const rates = {
  USD: { symbol: "$", rate: 1 },
  INR: { symbol: "₹", rate: 83 },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "USD");

  const changeCurrency = (code) => {
    setCurrency(code);
    localStorage.setItem("currency", code);
  };

  const formatAmount = (usdAmount) => {
    const { symbol, rate } = rates[currency];
    const converted = usdAmount * rate;
    const formatted = currency === "INR"
      ? converted.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : converted.toFixed(2);
    return `${symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
