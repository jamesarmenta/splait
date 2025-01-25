import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import type { BillSummary } from "@/lib/api";

interface RecentBillsProps {
  bills: BillSummary[];
  isLoading: boolean;
  error: string | null;
}

const RecentBills = ({ bills, isLoading, error }: RecentBillsProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold font-title">Recent Bills</h2>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4 pr-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading bills...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : bills.length === 0 ? (
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
                    <h3 className="font-medium font-title">{bill.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {bill.participant_count} participants · $
                      {bill.total_amount.toFixed(2)} ·{" "}
                      {formatDate(bill.updated_at)}
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
  );
};

export default RecentBills;
