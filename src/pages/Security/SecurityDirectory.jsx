import { useState, useEffect } from "react";
import { Phone, Home } from "lucide-react";
import api from "../../api/axios";

export default function SecurityDirectory() {
  const [residents, setResidents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [tower, setTower] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDirectory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (tower !== "All") params.append("tower", tower);

      const res = await api.get("/directory?" + params.toString());
      setResidents(res.data);
      if (res.data.length > 0 && !selected) {
        setSelected(res.data[0]);
      }
    } catch (err) {
      setError("Failed to load directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(function () {
      fetchDirectory();
    }, 300);
    return function () {
      clearTimeout(debounce);
    };
  }, [search, tower]);

  const towers = ["All", "Tower A", "Tower B", "Tower C"];

  let callButton = (
    <div className="w-full mt-5 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
      <Phone size={14} />
      <span>Call Resident</span>
    </div>
  );

  if (selected && selected.phone) {
    const callHref = "tel:" + selected.phone;
    callButton = (
      
        href={callHref}
        className="w-full mt-5 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium bg-green-600 text-white"
      >
        <Phone size={14} />
        <span>Call Resident</span>
      </a>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Resident Directory</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Look up resident contact info for gate verification</p>

      <div className="flex justify-between items-center mb-4 gap-3">
        <input
          value={search}
          onChange={function (e) { setSearch(e.target.value); }}
          placeholder="Search name or unit..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        />
        <select
          value={tower}
          onChange={function (e) { setTower(e.target.value); }}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        >
          {towers.map(function (tw) {
            const label = tw === "All" ? "Block: All" : "Block: " + tw;
            return (
              <option key={tw} value={tw}>
                {label}
              </option>
            );
          })}
        </select>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3">Resident Name</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Tower</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && residents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                    No residents found
                  </td>
                </tr>
              )}
              {!loading && residents.map(function (r) {
                const isSelected = selected && selected._id === r._id;
                const rowClass = isSelected
                  ? "border-t border-gray-100 dark:border-gray-800 cursor-pointer bg-green-50 dark:bg-green-950"
                  : "border-t border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800";
                const statusClass = r.status === "owner"
                  ? "text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                  : "text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400";
                const statusLabel = r.status === "owner" ? "Owner" : "Tenant";

                return (
                  <tr key={r._id} onClick={function () { setSelected(r); }} className={rowClass}>
                    <td className="px-4 py-3 flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                      <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center text-xs font-semibold">
                        {r.fullName.charAt(0)}
                      </div>
                      <span>{r.fullName}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.unit || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.tower || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.phone || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={statusClass}>{statusLabel}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-fit transition-colors">
          {!selected && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">Select a resident to view details</p>
          )}

          {selected && (
            <div>
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                  {selected.fullName.charAt(0)}
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selected.fullName}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {selected.tower} {selected.unit ? "- " + selected.unit : ""}
                </p>
                <span className="mt-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-medium">
                  {selected.status === "owner" ? "Owner" : "Tenant"}
                </span>
              </div>

              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Phone Number</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {selected.phone || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Home size={14} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Unit</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {selected.tower} {selected.unit ? "- " + selected.unit : ""}
                    </p>
                  </div>
                </div>
              </div>

              {callButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
