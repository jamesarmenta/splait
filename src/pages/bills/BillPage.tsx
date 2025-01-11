import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBill } from "@/hooks/useBill";
import { createNewBill } from "@/types/bill";
import BillEditor from "@/components/home";
import { api } from "@/lib/api";
import { userStorage } from "@/lib/user";

export default function BillPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = React.useState(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const loadBill = async () => {
      try {
        const loadedBill = await api.getBill(id);
        setBill(loadedBill);

        // Add current user if they exist and aren't already in the bill
        const user = userStorage.getUser();
        if (
          user &&
          !loadedBill.participants.some((p) => p.name === user.name)
        ) {
          const updatedBill = {
            ...loadedBill,
            participants: [
              ...loadedBill.participants,
              {
                id: crypto.randomUUID(),
                name: user.name,
                emojiName: user.emojiName,
              },
            ],
          };
          await api.updateBill(id, updatedBill);
          setBill(updatedBill);
        }
      } catch (err) {
        if (err.message === "Bill not found") {
          const newBill = createNewBill();
          newBill.id = id;

          // Add current user if they exist
          const user = userStorage.getUser();
          if (user) {
            newBill.participants = [
              {
                id: crypto.randomUUID(),
                name: user.name,
                emojiName: user.emojiName,
              },
            ];
          }

          await api.createBill(newBill);
          setBill(newBill);
        } else {
          setError("Failed to load bill");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadBill();
  }, [id, navigate]);

  const handleBillUpdate = React.useCallback(async (updatedBill: Bill) => {
    try {
      await api.updateBill(updatedBill.id, updatedBill);
    } catch (err) {
      console.error("Failed to save bill:", err);
    }
  }, []);

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

  return <BillEditor initialBill={bill} onBillUpdate={handleBillUpdate} />;
}
