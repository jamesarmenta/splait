import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Plus } from "lucide-react";
import type { Bill } from "@/types/bill";
import { api } from "@/lib/api";

export default function BillsPage() {
  const navigate = useNavigate();
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadBills = async () => {
      try {
        const loadedBills = await api.listBills();
        setBills(loadedBills);
      } catch (err) {
        setError("Failed to load bills");
      } finally {
        setIsLoading(false);
      }
    };

    loadBills();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-title">My Bills</h1>
          <Button onClick={() => navigate("/")}>
            <Plus className="mr-2 h-4 w-4" />
            New Bill
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 pr-4">
            {bills.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                No bills yet. Create your first bill to get started!
              </Card>
            ) : (
              bills.map((bill) => (
                <Card
                  key={bill.id}
                  className="p-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => navigate(`/bills/${bill.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="font-medium font-title">{bill.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {bill.participants.length} participants ·{" "}
                        {formatDate(bill.updatedAt)}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
