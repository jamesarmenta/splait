import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Profile from "@/components/home/Profile";
import CreateBill from "@/components/home/CreateBill";
import JoinBill from "@/components/home/JoinBill";
import RecentBills from "@/components/home/RecentBills";
import type { BillSummary } from "@/lib/api";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentBills, setRecentBills] = React.useState<BillSummary[]>([]);
  const [isLoadingBills, setIsLoadingBills] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) {
      console.log("No user, skipping bill load");
      return;
    }

    const loadBills = async () => {
      console.log("Loading bills...");
      try {
        setIsLoadingBills(true);
        setError(null);
        const bills = await api.getUserBills();
        console.log("Loaded bills:", bills);
        setRecentBills(bills);
      } catch (err) {
        console.error("Failed to load bills:", err);
        setError("Failed to load bills");
      } finally {
        setIsLoadingBills(false);
      }
    };

    loadBills();
  }, [user]);

  const handleCreateBill = () => {
    // Implementation for creating a new bill
    navigate("/bills/new");
  };

  const handleJoinBill = (emojiCode: string[]) => {
    // Implementation for joining a bill using emoji code
    const billId = emojiCode.join("-");
    navigate(`/bills/${billId}`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-title">Totali</h1>
          <p className="text-muted-foreground">Split, tap, done</p>
        </div>

        <Profile />
        <CreateBill onCreateBill={handleCreateBill} />
        <JoinBill onJoinBill={handleJoinBill} />

        {user && (
          <RecentBills
            bills={recentBills}
            isLoading={isLoadingBills}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
