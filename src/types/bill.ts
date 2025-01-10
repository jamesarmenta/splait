export interface BillParticipant {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface BillItemAssignment {
  participantId: string;
  portions: number;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  assignedTo: BillItemAssignment[];
}

export interface Bill {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  items: BillItem[];
  participants: BillParticipant[];
  tax: {
    amount: number;
    percentage?: number;
  };
  tip: {
    amount: number;
    percentage?: number;
  };
  shareUrl?: string;
}

export interface BillSummary {
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  participantTotals: {
    [participantId: string]: {
      subtotal: number;
      tax: number;
      tip: number;
      total: number;
      items: Array<{
        itemId: string;
        name: string;
        portions: number;
        totalPortions: number;
        amount: number;
      }>;
    };
  };
}

export const calculateBillSummary = (bill: Bill): BillSummary => {
  const subtotal = bill.items.reduce((sum, item) => sum + item.price, 0);
  const tax = bill.tax.amount;
  const tip = bill.tip.amount;
  const total = subtotal + tax + tip;

  const participantTotals: BillSummary["participantTotals"] = {};

  // Initialize participant totals
  bill.participants.forEach((participant) => {
    participantTotals[participant.id] = {
      subtotal: 0,
      tax: 0,
      tip: 0,
      total: 0,
      items: [],
    };
  });

  // Calculate item assignments
  bill.items.forEach((item) => {
    const totalPortions = item.assignedTo.reduce(
      (sum, a) => sum + a.portions,
      0,
    );
    if (totalPortions === 0) return;

    item.assignedTo.forEach((assignment) => {
      const share = item.price * (assignment.portions / totalPortions);
      const participant = participantTotals[assignment.participantId];
      if (participant) {
        participant.subtotal += share;
        participant.items.push({
          itemId: item.id,
          name: item.name,
          portions: assignment.portions,
          totalPortions,
          amount: share,
        });
      }
    });
  });

  // Calculate tax and tip shares
  Object.values(participantTotals).forEach((participant) => {
    if (subtotal > 0) {
      const share = participant.subtotal / subtotal;
      participant.tax = tax * share;
      participant.tip = tip * share;
      participant.total =
        participant.subtotal + participant.tax + participant.tip;
    }
  });

  return {
    subtotal,
    tax,
    tip,
    total,
    participantTotals,
  };
};

export const createNewBill = (title: string = "New Bill"): Bill => ({
  id: crypto.randomUUID(),
  title,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  items: [],
  participants: [],
  tax: {
    amount: 0,
    percentage: 0,
  },
  tip: {
    amount: 0,
    percentage: 15,
  },
});
