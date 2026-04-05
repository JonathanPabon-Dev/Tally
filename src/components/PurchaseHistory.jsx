const PurchaseHistory = ({ purchases, onSelect, onNew }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 p-4 duration-500">
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

      <div className="grid gap-4">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            onClick={() => onSelect(purchase)}
            className="group flex cursor-pointer items-center justify-between rounded-xl bg-slate-100 p-4 transition-all hover:shadow-md"
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
              <span className="text-xl font-bold text-slate-900">
                ${purchase.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistory;
