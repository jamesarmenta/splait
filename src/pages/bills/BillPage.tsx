import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BillEditor from "@/components/home";
import { api, type FormattedBill } from "@/lib/api";

export default function BillPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = React.useState<FormattedBill | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const loadBill = async () => {
      try {
        const billData = await api.getBill(id);
        setBill(billData);
      } catch (err) {
        console.error("Failed to load bill:", err);
        setError("Failed to load bill");
      } finally {
        setIsLoading(false);
      }
    };

    loadBill();
  }, [id, navigate]);

  const handleBillUpdate = React.useCallback(
    async (updates: Partial<FormattedBill>) => {
      if (!bill?.id) return;
      try {
        await api.updateBill(bill.id, updates);
      } catch (err) {
        console.error("Failed to update bill:", err);
      }
    },
    [bill?.id],
  );

  const handleAddParticipant = React.useCallback(
    async (name: string) => {
      if (!bill?.id) return;
      try {
        await api.addParticipant(bill.id, name, "happy");
      } catch (err) {
        console.error("Failed to add participant:", err);
      }
    },
    [bill?.id],
  );

  const handleRemoveParticipant = React.useCallback(
    async (participantId: string) => {
      try {
        await api.removeParticipant(participantId);
      } catch (err) {
        console.error("Failed to remove participant:", err);
      }
    },
    [],
  );

  const handleAddItem = React.useCallback(
    async (item: { name: string; price: number }) => {
      if (!bill?.id) return;
      try {
        await api.addItem(bill.id, item);
      } catch (err) {
        console.error("Failed to add item:", err);
      }
    },
    [bill?.id],
  );

  const handleUpdateItem = React.useCallback(
    async (itemId: string, updates: { name: string; price: number }) => {
      try {
        await api.updateItem(itemId, updates);
      } catch (err) {
        console.error("Failed to update item:", err);
      }
    },
    [],
  );

  const handleDeleteItem = React.useCallback(async (itemId: string) => {
    try {
      await api.deleteItem(itemId);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  }, []);

  const handleAssignItem = React.useCallback(
    async (itemId: string, participantId: string, portions: number = 1) => {
      try {
        await api.assignItem(itemId, participantId, portions);
      } catch (err) {
        console.error("Failed to assign item:", err);
      }
    },
    [],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-destructive">{error}</p>
      </div>
    );
  }

  if (!bill) return null;

  return (
    <BillEditor
      initialBill={bill}
      onBillUpdate={handleBillUpdate}
      onAddParticipant={handleAddParticipant}
      onRemoveParticipant={handleRemoveParticipant}
      onAddItem={handleAddItem}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
      onAssignItem={handleAssignItem}
    />
  );
}
