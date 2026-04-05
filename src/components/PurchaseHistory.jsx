import { useState } from "react";

const PurchaseHistory = ({ purchases, onSelect, onNew }) => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().substring(0, 7),
  );

  const filteredPurchases = purchases.filter((purchase) => {
    return purchase.purchase_date.startsWith(selectedMonth);
  });

  const monthlyTotal = filteredPurchases.reduce(
    (acc, p) => acc + p.total_amount,
    0,
  );

  const handleSelectedMonth = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4 p-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Purchases</h1>
          <p className="text-sm text-slate-500">Overview of your spending</p>
        </div>
        <button
          onClick={onNew}
          className="cursor-pointer rounded-xl bg-emerald-500 p-2 text-sm text-white transition-all hover:bg-emerald-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-5" // Controla el tamaño con clases de Tailwind
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </header>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Filter by Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleSelectedMonth}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-700 transition-colors outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 text-right">
            <p className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">
              Monthly Spending
            </p>
            <p className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Badge de conteo rápido */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
          <p className="text-xs font-medium text-slate-500">
            {filteredPurchases.length} transactions
          </p>
        </div>
      </section>

      {/* Listado de compras */}
      {filteredPurchases.length > 0 && (
        <div className="grid gap-4">
          {filteredPurchases.map((purchase) => (
            <div
              key={purchase.id}
              onClick={() => onSelect(purchase)}
              className="group flex cursor-pointer items-center justify-between rounded-xl bg-slate-100 px-4 py-2 transition-all hover:shadow-md"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {new Date(purchase.purchase_date).toLocaleString()}
                </span>
                <h3 className="font-medium text-slate-800 transition-colors group-hover:text-indigo-900">
                  {purchase.description || "Untitled Purchase"}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-slate-600">
                  ${purchase.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
