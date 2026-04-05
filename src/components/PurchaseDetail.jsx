import { useState, useEffect } from "react";

const PurchaseDetail = ({
  purchase,
  items,
  onBack,
  onSave,
  onEdit,
  onDelete,
}) => {
  const [editableItems, setEditableItems] = useState([]);
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", qty: 1, disc: 0 });

  const isNew = !purchase;
  const showEditor = isNew || isEditing;

  const displayItems = [...editableItems].sort((a, b) => {
    const nameA = (a.product_name || a.name).toLowerCase();
    const nameB = (b.product_name || b.name).toLowerCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });

  const currentTotal = displayItems.reduce(
    (acc, i) => acc + (i.subtotal || i.total),
    0,
  );

  const addItem = () => {
    if (!form.name || !form.price) return;
    const subtotal =
      parseFloat(form.price) * parseInt(form.qty) * (1 - form.disc / 100);
    setEditableItems([...editableItems, { ...form, total: subtotal }]);
    setForm({ name: "", price: "", qty: 1, disc: 0 });
  };

  const removeItem = (index) => {
    const updated = displayItems.filter((_, i) => i !== index);
    setEditableItems(updated);
  };

  const handleFinalAction = () => {
    if (isNew) {
      onSave(editableItems, currentTotal, description);
    } else {
      onEdit(purchase.id, editableItems, currentTotal, description);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (purchase) {
      setDescription(purchase.description || "");
      setEditableItems(items || []);
      return;
    }
    setDescription("");
    setEditableItems([]);
  }, [purchase, items]);

  return (
    <div className="animate-in slide-in-from-right flex flex-col duration-300">
      {/* Header Estilo Midnight Blue */}
      <header className="rounded-xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={isEditing ? () => setIsEditing(false) : onBack}
            className="flex h-full cursor-pointer items-center rounded-xl border border-inherit p-2 text-sm opacity-50 hover:opacity-100"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            {isEditing ? "Cancel" : "Back to History"}
          </button>
          {showEditor && editableItems.length > 0 && (
            <button
              onClick={handleFinalAction}
              className="rounded-xl bg-emerald-500 p-2 font-bold text-white hover:bg-emerald-600"
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </button>
          )}
          {!showEditor && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="cursor-pointer rounded-xl bg-blue-600 p-2 font-bold text-white hover:bg-blue-700"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Delete this entire purchase record?")) {
                    onDelete(purchase.id);
                  }
                }}
                className="cursor-pointer rounded-xl bg-red-600 p-2 font-bold text-white hover:bg-red-700"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <p className="mb-1 text-xs font-bold tracking-widest text-indigo-300 uppercase">
          Current Balance
        </p>
        <h2 className="text-3xl tracking-wide">${currentTotal.toFixed(2)}</h2>
      </header>

      <div className="mx-auto w-full max-w-md space-y-8 rounded-xl p-4">
        {/* Campo para el Nombre de la Compra */}
        {showEditor && (
          <section className="space-y-2">
            <input
              type="text"
              placeholder="Purchase Name"
              className="w-full border-b border-inherit py-2 text-sm font-bold text-slate-500 uppercase transition-colors outline-none focus:border-indigo-500"
              value={description}
              maxLength={20}
              onChange={(e) => setDescription(e.target.value.toUpperCase())}
            />
          </section>
        )}

        {/* Formulario de compra */}
        {showEditor && (
          <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="text"
              placeholder="Product name"
              className="w-full border-b border-slate-200 bg-transparent py-2 text-slate-500 uppercase outline-none focus:border-indigo-500"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value.toUpperCase() })
              }
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Price"
                className="border-b border-slate-200 bg-transparent py-2 text-slate-500 outline-none"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                type="number"
                placeholder="Qty"
                className="border-b border-slate-200 bg-transparent py-2 text-slate-500 outline-none"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
              />
              <input
                type="number"
                placeholder="Disc %"
                className="border-b border-slate-200 bg-transparent py-2 text-rose-500 outline-none"
                value={form.disc}
                onChange={(e) => setForm({ ...form, disc: e.target.value })}
              />
            </div>
            <button
              onClick={addItem}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Item
            </button>
          </section>
        )}

        {/* Listado de Items */}
        <section className="flex flex-col space-y-4">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            {!showEditor
              ? `Items for ${purchase.description}`
              : "Itemized Breakdown"}
          </h3>
          <div
            className={`${showEditor ? "max-h-80" : "max-h-9/12"} space-y-4 overflow-y-auto`}
          >
            {displayItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-slate-50 bg-white p-2 shadow-sm"
              >
                <div>
                  <h4 className="text-sm font-semibold tracking-tight text-slate-800 uppercase">
                    {item.product_name || item.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {item.quantity || item.qty} units • $
                    {item.net_price || item.price}
                    {(item.discount_percentage > 0 || item.disc > 0) && (
                      <span className="ml-1 text-rose-500">
                        (-{item.discount_percentage || item.disc}%)
                      </span>
                    )}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-sm font-bold text-slate-900">
                    ${(item.subtotal || item.total).toFixed(2)}
                  </span>
                </div>
                {showEditor && (
                  <button
                    onClick={() => removeItem(idx)}
                    className="ml-3 flex items-center justify-center rounded-xl bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                  >
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PurchaseDetail;
