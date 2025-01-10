import type { Bill } from "@/types/bill";

// Sample dummy data
let BILLS: Bill[] = [
  {
    id: "bill_1",
    title: "Dinner at Italian Restaurant",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    items: [
      {
        id: "item_1",
        name: "Margherita Pizza",
        price: 14.99,
        assignedTo: [
          { participantId: "user_1", portions: 2 },
          { participantId: "user_2", portions: 1 },
        ],
      },
      {
        id: "item_2",
        name: "Tiramisu",
        price: 8.99,
        assignedTo: [{ participantId: "user_2", portions: 1 }],
      },
    ],
    participants: [
      {
        id: "user_1",
        name: "John",
        emoji: "🙂",
      },
      {
        id: "user_2",
        name: "Sarah",
        emoji: "😊",
      },
    ],
    tax: {
      amount: 2.4,
      percentage: 10,
    },
    tip: {
      amount: 4.8,
      percentage: 20,
    },
    shareUrl: "https://split.bill/bill_1",
  },
  {
    id: "bill_2",
    title: "Movie Night",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    items: [
      {
        id: "item_3",
        name: "Movie Tickets",
        price: 32.0,
        assignedTo: [
          { participantId: "user_3", portions: 1 },
          { participantId: "user_4", portions: 1 },
        ],
      },
      {
        id: "item_4",
        name: "Popcorn & Drinks",
        price: 15.5,
        assignedTo: [
          { participantId: "user_3", portions: 1 },
          { participantId: "user_4", portions: 1 },
        ],
      },
    ],
    participants: [
      {
        id: "user_3",
        name: "Mike",
        emoji: "😎",
      },
      {
        id: "user_4",
        name: "Emma",
        emoji: "🦋",
      },
    ],
    tax: {
      amount: 3.8,
      percentage: 8,
    },
    tip: {
      amount: 0,
      percentage: 0,
    },
    shareUrl: "https://split.bill/bill_2",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  async createBill(bill: Bill): Promise<Bill> {
    await delay(500); // Simulate network delay
    BILLS.unshift(bill); // Add to start of array
    return bill;
  },

  async getBill(id: string): Promise<Bill> {
    await delay(500);
    const bill = BILLS.find((b) => b.id === id);
    if (!bill) {
      throw new Error("Bill not found");
    }
    return bill;
  },

  async updateBill(id: string, bill: Bill): Promise<Bill> {
    await delay(500);
    const index = BILLS.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Bill not found");
    }
    BILLS[index] = bill;
    return bill;
  },

  async deleteBill(id: string): Promise<void> {
    await delay(500);
    const index = BILLS.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Bill not found");
    }
    BILLS.splice(index, 1);
  },

  async listBills(): Promise<Bill[]> {
    await delay(500);
    return BILLS;
  },
};
