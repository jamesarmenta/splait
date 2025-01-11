import { useState, useCallback } from "react";
import { getRandomEmojiName } from "@/lib/emoji";
import {
  Bill,
  BillItem,
  BillParticipant,
  calculateBillSummary,
} from "@/types/bill";

export const useBill = (initialBill: Bill) => {
  const [bill, setBill] = useState<Bill>(initialBill);
  const summary = calculateBillSummary(bill);

  const updateBill = useCallback((updates: Partial<Bill>) => {
    setBill((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addParticipant = useCallback(
    (name: string) => {
      const newParticipant: BillParticipant = {
        id: crypto.randomUUID(),
        name,
        emojiName: getRandomEmojiName(),
      };

      updateBill({
        participants: [...bill.participants, newParticipant],
      });
    },
    [bill.participants, updateBill],
  );

  const removeParticipant = useCallback(
    (participantId: string) => {
      // Remove participant from all items first
      const updatedItems = bill.items.map((item) => ({
        ...item,
        assignedTo: item.assignedTo.filter(
          (a) => a.participantId !== participantId,
        ),
      }));

      updateBill({
        items: updatedItems,
        participants: bill.participants.filter((p) => p.id !== participantId),
      });
    },
    [bill.items, bill.participants, updateBill],
  );

  const addItem = useCallback(
    (item: { name: string; price: number }) => {
      const newItem: BillItem = {
        id: crypto.randomUUID(),
        ...item,
        assignedTo: [],
      };

      updateBill({
        items: [...bill.items, newItem],
      });
    },
    [bill.items, updateBill],
  );

  const updateItem = useCallback(
    (itemId: string, updates: Partial<BillItem>) => {
      updateBill({
        items: bill.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item,
        ),
      });
    },
    [bill.items, updateBill],
  );

  const deleteItem = useCallback(
    (itemId: string) => {
      updateBill({
        items: bill.items.filter((item) => item.id !== itemId),
      });
    },
    [bill.items, updateBill],
  );

  const assignItemToParticipant = useCallback(
    (itemId: string, participantId: string, portions: number = 1) => {
      updateBill({
        items: bill.items.map((item) => {
          if (item.id !== itemId) return item;

          const currentAssignments = item.assignedTo;
          const participantIndex = currentAssignments.findIndex(
            (a) => a.participantId === participantId,
          );

          let newAssignments;
          if (participantIndex >= 0) {
            if (portions === 0) {
              newAssignments = currentAssignments.filter(
                (a) => a.participantId !== participantId,
              );
            } else {
              newAssignments = currentAssignments.map((a) =>
                a.participantId === participantId ? { ...a, portions } : a,
              );
            }
          } else if (portions > 0) {
            newAssignments = [
              ...currentAssignments,
              { participantId, portions },
            ];
          } else {
            newAssignments = currentAssignments;
          }

          return {
            ...item,
            assignedTo: newAssignments,
          };
        }),
      });
    },
    [bill.items, updateBill],
  );

  const updateTax = useCallback(
    (amount: number, percentage?: number) => {
      updateBill({
        tax: { amount, percentage },
      });
    },
    [updateBill],
  );

  const updateTip = useCallback(
    (amount: number, percentage?: number) => {
      updateBill({
        tip: { amount, percentage },
      });
    },
    [updateBill],
  );

  return {
    bill,
    summary,
    updateBill,
    addParticipant,
    removeParticipant,
    addItem,
    updateItem,
    deleteItem,
    assignItemToParticipant,
    updateTax,
    updateTip,
  };
};
