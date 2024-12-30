import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: Array<{
    participantId: string;
    share: number;
  }>;
}

interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  total: number;
  items: number;
}

interface BillSummaryProps {
  participants?: Participant[];
  items?: ReceiptItem[];
  tax?: number;
  taxPercentage?: number;
  tip?: number;
  onTaxChange?: (value: number, percentage: number) => void;
  onTipChange?: (value: number) => void;
}

const TIP_PERCENTAGES = [10, 15, 18, 20];

const BillSummary = ({
  participants = [],
  items = [],
  tax = 0,
  taxPercentage = 0,
  tip = 0,
  onTaxChange = () => {},
  onTipChange = () => {},
}: BillSummaryProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + tax + tip;
  const [tipMode, setTipMode] = useState<"percentage" | "amount">("percentage");
  const [tipPercentage, setTipPercentage] = useState(
    subtotal > 0 ? Math.round((tip / subtotal) * 100) : 15,
  );

  // Update tax when subtotal or tax percentage changes
  useEffect(() => {
    const newTax = (subtotal * taxPercentage) / 100;
    onTaxChange(newTax, taxPercentage);
  }, [subtotal, taxPercentage, onTaxChange]);

  const handleTipPercentageChange = (percentage: number) => {
    setTipPercentage(percentage);
    onTipChange((subtotal * percentage) / 100);
  };

  const handleTipAmountChange = (amount: number) => {
    onTipChange(amount);
    if (subtotal > 0) {
      setTipPercentage(Math.round((amount / subtotal) * 100));
    }
  };

  const handleTaxChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const percentage = subtotal > 0 ? (amount / subtotal) * 100 : 0;
    onTaxChange(amount, percentage);
  };

  const getParticipantItems = (participantId: string) => {
    return items
      .filter((item) =>
        item.assignedTo.some((a) => a.participantId === participantId),
      )
      .map((item) => {
        const assignment = item.assignedTo.find(
          (a) => a.participantId === participantId,
        );
        return {
          name: item.name,
          amount: item.price * (assignment?.share || 0),
        };
      });
  };

  const getParticipantShare = (participant: Participant) => {
    if (subtotal === 0) return 0;
    return participant.total / subtotal;
  };

  return (
    <Card className="p-6 w-full bg-white shadow-sm space-y-6">
      <ScrollArea className="max-h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
          {participants.map((participant) => {
            const participantItems = getParticipantItems(participant.id);
            const sharePercentage = getParticipantShare(participant);
            const participantTax = tax * sharePercentage;
            const participantTip = tip * sharePercentage;
            const participantTotal =
              participant.total + participantTax + participantTip;

            return (
              <div
                key={participant.id}
                className="flex flex-col p-4 rounded-lg bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={participant.avatarUrl}
                      alt={participant.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="font-medium">{participant.name}</span>
                  </div>
                  <span className="text-primary font-semibold">
                    ${participantTotal.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  {participantItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span className="truncate mr-2">{item.name}</span>
                      <span>${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  {(participantTax > 0 || participantTip > 0) && (
                    <>
                      <Separator className="my-2" />
                      <div className="space-y-1 text-sm text-gray-600">
                        {participantTax > 0 && (
                          <div className="flex justify-between">
                            <span>
                              Tax ({(sharePercentage * 100).toFixed(1)}%)
                            </span>
                            <span>${participantTax.toFixed(2)}</span>
                          </div>
                        )}
                        {participantTip > 0 && (
                          <div className="flex justify-between">
                            <span>
                              Tip ({(sharePercentage * 100).toFixed(1)}%)
                            </span>
                            <span>${participantTip.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax" className="text-sm">
            Tax ({taxPercentage.toFixed(1)}%)
          </Label>
          <div className="flex items-center gap-2 justify-between">
            <Input
              id="tax"
              type="number"
              value={tax}
              onChange={(e) => handleTaxChange(e.target.value)}
              className="w-24"
              step="0.01"
            />
            <span className="text-sm text-gray-600">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tip" className="text-sm">
              Tip
            </Label>
            <Tabs
              value={tipMode}
              onValueChange={(v) => setTipMode(v as "percentage" | "amount")}
            >
              <TabsList className="h-8">
                <TabsTrigger value="percentage" className="text-xs">
                  Percentage
                </TabsTrigger>
                <TabsTrigger value="amount" className="text-xs">
                  Amount
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {tipMode === "percentage" ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                {TIP_PERCENTAGES.map((percent) => (
                  <Button
                    key={percent}
                    variant={tipPercentage === percent ? "default" : "outline"}
                    className="flex-1 text-sm"
                    onClick={() => handleTipPercentageChange(percent)}
                  >
                    {percent}%
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={tipPercentage}
                    onChange={(e) =>
                      handleTipPercentageChange(parseFloat(e.target.value))
                    }
                    className="w-20"
                  />
                  <span className="text-sm">%</span>
                </div>
                <span className="text-sm text-gray-600">${tip.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-between">
              <Input
                type="number"
                value={tip}
                onChange={(e) =>
                  handleTipAmountChange(parseFloat(e.target.value))
                }
                className="w-24"
                step="0.01"
              />
              <span className="text-sm text-gray-600">${tip.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};

export default BillSummary;
