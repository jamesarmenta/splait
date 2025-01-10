import React, { useState, useCallback } from "react";
import ReceiptHeader from "./receipt/ReceiptHeader";
import ItemizedList from "./receipt/ItemizedList";
import ParticipantList from "./receipt/ParticipantList";
import BillTotals from "./receipt/BillTotals";
import ParticipantSummaries from "./receipt/ParticipantSummaries";

interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  total: number;
  itemCount: number;
  totalPortions: number;
}

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: Array<{
    participantId: string;
    portions: number;
  }>;
}

interface HomeProps {
  receiptData?: {
    title?: string;
    totalAmount?: number;
    shareUrl?: string;
    items?: ReceiptItem[];
    participants?: Participant[];
    tax?: number;
    taxPercentage?: number;
    tip?: number;
    tipPercentage?: number;
  };
}

const defaultReceiptData = {
  title: "Dinner at Restaurant",
  totalAmount: 36.37,
  shareUrl: "https://split.bill/abc123",
  items: [
    {
      id: "1",
      name: "Margherita Pizza",
      price: 14.99,
      assignedTo: [],
    },
    {
      id: "2",
      name: "Caesar Salad",
      price: 8.99,
      assignedTo: [],
    },
  ],
  participants: [
    {
      id: "1",
      name: "John Doe",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      total: 0,
      itemCount: 0,
      totalPortions: 0,
    },
    {
      id: "2",
      name: "Jane Smith",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      total: 0,
      itemCount: 0,
      totalPortions: 0,
    },
  ],
  tax: 3.54,
  taxPercentage: 15,
  tip: 8.85,
  tipPercentage: 20,
};

const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

const Home = ({
  receiptData: initialReceiptData = defaultReceiptData,
}: HomeProps) => {
  const [receiptData, setReceiptData] = useState(initialReceiptData);

  const updateTipFromPercentage = (
    totalAmount: number,
    tipPercentage: number,
  ) => {
    return roundToTwoDecimals((totalAmount * tipPercentage) / 100);
  };

  const handleItemAssign = (
    itemId: string,
    participantId: string,
    portions: number = 1,
  ) => {
    setReceiptData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          const currentAssignments = item.assignedTo;
          const participantIndex = currentAssignments.findIndex(
            (a) => a.participantId === participantId,
          );

          let newAssignments;
          if (participantIndex >= 0) {
            if (portions === 0) {
              // Remove participant if portions set to 0
              newAssignments = currentAssignments.filter(
                (a) => a.participantId !== participantId,
              );
            } else {
              // Update portions for existing participant
              newAssignments = currentAssignments.map((a) =>
                a.participantId === participantId ? { ...a, portions } : a,
              );
            }
          } else {
            // Add new participant with specified portions
            newAssignments = [
              ...currentAssignments,
              {
                participantId,
                portions,
              },
            ];
          }

          return {
            ...item,
            assignedTo: newAssignments,
          };
        }
        return item;
      });

      // Recalculate participant totals
      const updatedParticipants = prev.participants.map((p) => {
        let total = 0;
        let participantItemCount = 0;
        let totalPortions = 0;

        updatedItems.forEach((item) => {
          const assignment = item.assignedTo.find(
            (a) => a.participantId === p.id,
          );
          if (assignment) {
            const totalItemPortions = item.assignedTo.reduce(
              (sum, a) => sum + a.portions,
              0,
            );
            total += (item.price * assignment.portions) / totalItemPortions;
            participantItemCount++;
            totalPortions += assignment.portions;
          }
        });

        return {
          ...p,
          total: roundToTwoDecimals(total),
          itemCount: participantItemCount,
          totalPortions,
        };
      });

      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price,
        0,
      );
      const newTip = prev.tipPercentage
        ? updateTipFromPercentage(totalAmount, prev.tipPercentage)
        : prev.tip;

      return {
        ...prev,
        items: updatedItems,
        participants: updatedParticipants,
        totalAmount,
        tip: roundToTwoDecimals(newTip),
      };
    });
  };

  const handleAddParticipant = (name: string) => {
    setReceiptData((prev) => {
      const newParticipant = {
        id: `p${prev.participants.length + 1}`,
        name,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.toLowerCase()}`,
        total: 0,
        itemCount: 0,
        totalPortions: 0,
      };

      return {
        ...prev,
        participants: [...prev.participants, newParticipant],
      };
    });
  };

  const handleRemoveParticipant = (participantId: string) => {
    setReceiptData((prev) => {
      // Remove participant from all items first
      const updatedItems = prev.items.map((item) => ({
        ...item,
        assignedTo: item.assignedTo.filter(
          (a) => a.participantId !== participantId,
        ),
      }));

      // Then remove the participant
      return {
        ...prev,
        items: updatedItems,
        participants: prev.participants.filter((p) => p.id !== participantId),
      };
    });
  };

  const handleAddItem = (item: { name: string; price: number }) => {
    setReceiptData((prev) => {
      const newItems = [
        ...prev.items,
        {
          id: `i${prev.items.length + 1}`,
          ...item,
          assignedTo: [],
        },
      ];
      const totalAmount = newItems.reduce((sum, item) => sum + item.price, 0);
      const newTip = prev.tipPercentage
        ? updateTipFromPercentage(totalAmount, prev.tipPercentage)
        : prev.tip;

      return {
        ...prev,
        items: newItems,
        totalAmount,
        tip: roundToTwoDecimals(newTip),
      };
    });
  };

  const handleUpdateItem = (
    id: string,
    updates: { name: string; price: number },
  ) => {
    setReceiptData((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item,
      );
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price,
        0,
      );
      const newTip = prev.tipPercentage
        ? updateTipFromPercentage(totalAmount, prev.tipPercentage)
        : prev.tip;

      return {
        ...prev,
        items: updatedItems,
        totalAmount,
        tip: roundToTwoDecimals(newTip),
      };
    });
  };

  const handleDeleteItem = (id: string) => {
    setReceiptData((prev) => {
      const updatedItems = prev.items.filter((item) => item.id !== id);
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price,
        0,
      );
      const newTip = prev.tipPercentage
        ? updateTipFromPercentage(totalAmount, prev.tipPercentage)
        : prev.tip;

      return {
        ...prev,
        items: updatedItems,
        totalAmount,
        tip: roundToTwoDecimals(newTip),
      };
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <ReceiptHeader
          title={receiptData.title}
          totalAmount={receiptData.totalAmount}
          shareUrl={receiptData.shareUrl}
        />

        <ParticipantList
          participants={receiptData.participants}
          onAddParticipant={handleAddParticipant}
          onRemoveParticipant={handleRemoveParticipant}
        />

        <ItemizedList
          items={receiptData.items}
          participants={receiptData.participants}
          onItemAssign={handleItemAssign}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />

        <BillTotals
          subtotal={receiptData.totalAmount}
          tax={receiptData.tax}
          tip={receiptData.tip}
          tipPercentage={receiptData.tipPercentage}
          onTaxChange={(value) =>
            setReceiptData((prev) => ({
              ...prev,
              tax: value,
            }))
          }
          onTipChange={(value, percentage) =>
            setReceiptData((prev) => ({
              ...prev,
              tip: value,
              tipPercentage: percentage,
            }))
          }
        />

        <ParticipantSummaries
          participants={receiptData.participants}
          items={receiptData.items}
          tax={receiptData.tax}
          tip={receiptData.tip}
        />
      </div>
    </div>
  );
};

export default Home;
