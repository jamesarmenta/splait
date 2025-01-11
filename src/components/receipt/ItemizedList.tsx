import React, { useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import ReceiptItem from "./ReceiptItem";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo?: Array<{
    participantId: string;
    share: number;
  }>;
}

interface ItemizedListProps {
  items?: ReceiptItem[];
  participants?: {
    id: string;
    name: string;
    avatarUrl?: string;
  }[];
  onItemAssign?: (itemId: string, participantId: string) => void;
  onAddItem?: (item: { name: string; price: number }) => void;
  onUpdateItem?: (id: string, updates: { name: string; price: number }) => void;
  onDeleteItem?: (id: string) => void;
}

const defaultItems: ReceiptItem[] = [
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
];

const defaultParticipants = [
  {
    id: "1",
    name: "John Doe",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
];

const ItemizedList = ({
  items = defaultItems,
  participants = defaultParticipants,
  onItemAssign = () => {},
  onAddItem = () => {},
  onUpdateItem = () => {},
  onDeleteItem = () => {},
}: ItemizedListProps) => {
  const [newItem, setNewItem] = useState({ name: "", price: "" });

  const roundToTwoDecimals = (num: number): number => {
    return Math.round(num * 100) / 100;
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    onAddItem({
      name: newItem.name,
      price: roundToTwoDecimals(parseFloat(newItem.price)),
    });
    setNewItem({ name: "", price: "" });
  };

  return (
    <div className="w-full h-full py-[4]">
      <h2 className="text-lg font-semibold mb-4">Bill Items</h2>
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder={"Add item"}
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="flex-1"
        />
        <Input
          placeholder="Price"
          type="number"
          step="0.01"
          min="0"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="w-24"
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleAddItem}
          disabled={!newItem.name || !newItem.price}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="w-full">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <ReceiptItem
                {...item}
                participants={participants}
                onAssign={onItemAssign}
                onEdit={onUpdateItem}
                onDelete={onDeleteItem}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ItemizedList;
