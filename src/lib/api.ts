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
        emojiName: "pizza",
      },
      {
        id: "user_2",
        name: "Sarah",
        emojiName: "butterfly",
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
        emojiName: "game",
      },
      {
        id: "user_4",
        name: "Emma",
        emojiName: "star",
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
  {
    id: "bill_3",
    title: "Group Dinner at Sushi Place",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    items: [
      {
        id: "item_5",
        name: "Dragon Roll",
        price: 16.99,
        assignedTo: [{ participantId: "user_5", portions: 1 }],
      },
      {
        id: "item_6",
        name: "California Roll",
        price: 12.99,
        assignedTo: [{ participantId: "user_6", portions: 1 }],
      },
      {
        id: "item_7",
        name: "Spicy Tuna Roll",
        price: 14.99,
        assignedTo: [], // Unassigned item
      },
      {
        id: "item_8",
        name: "Miso Soup",
        price: 3.99,
        assignedTo: [{ participantId: "user_7", portions: 1 }],
      },
      {
        id: "item_9",
        name: "Edamame",
        price: 5.99,
        assignedTo: [], // Unassigned item
      },
      {
        id: "item_10",
        name: "Green Tea Ice Cream",
        price: 4.99,
        assignedTo: [{ participantId: "user_5", portions: 1 }],
      },
      {
        id: "item_11",
        name: "Sake",
        price: 18.99,
        assignedTo: [
          { participantId: "user_5", portions: 1 },
          { participantId: "user_6", portions: 1 },
          { participantId: "user_7", portions: 1 },
        ],
      },
    ],
    participants: [
      {
        id: "user_5",
        name: "Alex",
        emojiName: "sushi",
      },
      {
        id: "user_6",
        name: "Taylor",
        emojiName: "fish",
      },
      {
        id: "user_7",
        name: "Jordan",
        emojiName: "drink",
      },
    ],
    tax: {
      amount: 7.89,
      percentage: 10,
    },
    tip: {
      amount: 15.78,
      percentage: 20,
    },
    shareUrl: "https://split.bill/bill_3",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  async createBill(bill: Bill): Promise<Bill> {
    // Simulate network delay
    BILLS.unshift(bill); // Add to start of array
    return bill;
  },

  async getBill(id: string): Promise<Bill> {
    const bill = BILLS.find((b) => b.id === id);
    if (!bill) {
      throw new Error("Bill not found");
    }
    return bill;
  },

  async updateBill(id: string, bill: Bill): Promise<Bill> {
    const index = BILLS.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Bill not found");
    }
    BILLS[index] = bill;
    return bill;
  },

  async deleteBill(id: string): Promise<void> {
    const index = BILLS.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Bill not found");
    }
    BILLS.splice(index, 1);
  },

  async listBills(): Promise<Bill[]> {
    return BILLS;
  },
};
