import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import Header from "../components/Header";
import PurchaseHistory from "../components/PurchaseHistory";
import PurchaseDetail from "../components/PurchaseDetail";

const Dashboard = () => {
  const [view, setView] = useState("list"); // 'list' | 'detail'
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [items, setItems] = useState([]);

  const fetchPurchases = async () => {
    const { data } = await supabase
      .from("purchase_master")
      .select("*")
      .order("created_at", { ascending: false });
    setPurchases(data || []);
  };

  const handleViewDetail = async (purchase) => {
    const { data } = await supabase
      .from("purchase_items")
      .select("*")
      .eq("master_id", purchase.id);
    setSelectedPurchase(purchase);
    setItems(data || []);
    setView("detail");
  };

  const handleSavePurchase = async (newItems, total, description) => {
    const { data: master, error: masterError } = await supabase
      .from("purchase_master")
      .insert([
        {
          purchase_date: new Date(),
          total_amount: total,
          description:
            description.trim() || `Purchase ${new Date().toLocaleDateString()}`,
        },
      ])
      .select()
      .single();

    if (masterError) {
      console.error("Error saving master:", masterError);
      return;
    }

    const itemsToInsert = newItems.map((i) => ({
      master_id: master.id,
      product_name: i.name,
      net_price: parseFloat(i.price),
      quantity: parseInt(i.qty),
      discount_perc: parseFloat(i.disc),
      subtotal: i.total,
    }));

    const { error: itemsError } = await supabase
      .from("purchase_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Error saving items:", itemsError);
      return;
    }

    fetchPurchases();
    setView("list");
  };

  const handleEditPurchase = async (
    purchaseId,
    newItems,
    total,
    description,
  ) => {
    const { error: masterError } = await supabase
      .from("purchase_master")
      .update({
        total_amount: total,
        description:
          description.trim() || `Purchase ${new Date().toLocaleDateString()}`,
      })
      .eq("id", purchaseId);

    if (masterError) {
      console.error("Error al actualizar maestro:", masterError.message);
      return;
    }

    // 2. Eliminar los ítems viejos para esta compra
    const { error: deleteError } = await supabase
      .from("purchase_items")
      .delete()
      .eq("master_id", purchaseId);

    if (deleteError) {
      console.error("Error al limpiar ítems antiguos:", deleteError.message);
      return;
    }

    // 3. Insertar la nueva lista de ítems
    const itemsToInsert = newItems.map((i) => ({
      master_id: purchaseId,
      product_name: i.product_name || i.name,
      net_price: parseFloat(i.net_price || i.price),
      quantity: parseInt(i.quantity || i.qty),
      discount_perc: parseFloat(i.discount_perc || i.disc || 0),
      subtotal: i.subtotal || i.total,
    }));

    const { error: itemsError } = await supabase
      .from("purchase_items")
      .insert(itemsToInsert);

    if (itemsError)
      console.error("Error al re-insertar ítems:", itemsError.message);

    fetchPurchases();
    setView("list");
    setSelectedPurchase(null);
  };

  const handleDeletePurchase = async (id) => {
    const { error } = await supabase
      .from("purchase_master")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchPurchases();
      setView("list");
      setSelectedPurchase(null);
    } else {
      console.error("Error deleting:", error.message);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="flex size-full flex-col">
      <Header />
      <main className="container mx-auto">
        <div className="mx-auto max-w-md">
          {view === "list" ? (
            <PurchaseHistory
              purchases={purchases}
              onSelect={handleViewDetail}
              onNew={() => {
                setSelectedPurchase(null);
                setView("detail");
              }}
            />
          ) : (
            <PurchaseDetail
              purchase={selectedPurchase}
              items={items}
              onBack={() => setView("list")}
              onSave={handleSavePurchase}
              onEdit={handleEditPurchase}
              onDelete={handleDeletePurchase}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
