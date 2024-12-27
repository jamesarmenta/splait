import React from "react";
import { useState } from "react";
import ReceiptHeader from "./receipt/ReceiptHeader";
import ItemizedList from "./receipt/ItemizedList";
import ParticipantList from "./receipt/ParticipantList";
import BillSummary from "./receipt/BillSummary";

interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  total: number;
  items: number;
}

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: Array<{
    participantId: string;
    share: number;
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
    tip?: number;
  };
}

const defaultReceiptData = {
  title: "Dinner at Restaurant",
  totalAmount: 123.45,
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
      items: 0,
    },
    {
      id: "2",
      name: "Jane Smith",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      total: 0,
      items: 0,
    },
  ],
  tax: 3.54,
  tip: 8.85,
};

const calculateEvenShares = (
  price: number,
  numParticipants: number,
): number[] => {
  const totalCents = Math.round(price * 100);
  const baseShareCents = Math.floor(totalCents / numParticipants);
  const remainingCents = totalCents - baseShareCents * numParticipants;

  // Create array of base shares
  const shares = Array(numParticipants).fill(baseShareCents);

  // Distribute remaining cents one by one from the start
  for (let i = 0; i < remainingCents; i++) {
    shares[i]++;
  }

  // Convert back to dollars
  return shares.map((cents) => cents / 100);
};

const Home = ({
  receiptData: initialReceiptData = defaultReceiptData,
}: HomeProps) => {
  const [isShareOpen, setIsShareOpen] = useState(true);
  const [receiptData, setReceiptData] = useState(initialReceiptData);

  const handleItemAssign = (itemId: string, participantId: string) => {
    setReceiptData((prev) => {
      const item = prev.items.find((i) => i.id === itemId);
      if (!item) return prev;

      const updatedItems = prev.items.map((i) => {
        if (i.id === itemId) {
          const currentAssignments = i.assignedTo;
          const participantIndex = currentAssignments.findIndex(
            (a) => a.participantId === participantId,
          );

          let newAssignments;
          if (participantIndex >= 0) {
            // Remove participant if already assigned
            newAssignments = currentAssignments.filter(
              (a) => a.participantId !== participantId,
            );
            // Recalculate shares for remaining participants if any
            if (newAssignments.length > 0) {
              const shares = calculateEvenShares(
                i.price,
                newAssignments.length,
              );
              newAssignments = newAssignments.map((a, index) => ({
                participantId: a.participantId,
                share: shares[index] / i.price,
              }));
            }
          } else {
            // Add participant with recalculated shares
            const totalParticipants = currentAssignments.length + 1;
            const shares = calculateEvenShares(i.price, totalParticipants);

            newAssignments = [
              ...currentAssignments.map((a, index) => ({
                participantId: a.participantId,
                share: shares[index] / i.price,
              })),
              {
                participantId,
                share: shares[shares.length - 1] / i.price,
              },
            ];
          }

          return {
            ...i,
            assignedTo: newAssignments,
          };
        }
        return i;
      });

      // Recalculate participant totals
      const updatedParticipants = prev.participants.map((p) => {
        let total = 0;
        let itemCount = 0;

        updatedItems.forEach((item) => {
          const assignment = item.assignedTo.find(
            (a) => a.participantId === p.id,
          );
          if (assignment) {
            total += item.price * assignment.share;
            itemCount += 1;
          }
        });

        return {
          ...p,
          total,
          items: itemCount,
        };
      });

      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price,
        0,
      );

      return {
        ...prev,
        items: updatedItems,
        participants: updatedParticipants,
        totalAmount,
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
        items: 0,
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
    setReceiptData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `i${prev.items.length + 1}`,
          ...item,
          assignedTo: [],
        },
      ],
      totalAmount: prev.totalAmount + item.price,
    }));
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
      return {
        ...prev,
        items: updatedItems,
        totalAmount,
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
      return {
        ...prev,
        items: updatedItems,
        totalAmount,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
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

        <BillSummary
          participants={receiptData.participants}
          tax={receiptData.tax}
          tip={receiptData.tip}
          onTaxChange={(value) =>
            setReceiptData((prev) => ({ ...prev, tax: value }))
          }
          onTipChange={(value) =>
            setReceiptData((prev) => ({ ...prev, tip: value }))
          }
        />
      </div>
    </div>
  );
};

export default Home;
