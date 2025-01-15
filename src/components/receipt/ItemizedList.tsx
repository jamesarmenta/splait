import React, { useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Plus } from "lucide-react";
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
  const [newItem, setNewItem] = useState({ name: "", price: 0 });

  const handleAddItem = () => {
    if (!newItem.name) return;
    if (newItem.name.length > 50) return;
    onAddItem({
      name: newItem.name,
      price: newItem.price,
    });
    setNewItem({ name: "", price: 0 });
  };

  return (
    <div className="w-full flex flex-col gap-y-4">
      <Card className="p-4 gap-4">
        <h2 className="text-lg font-semibold">Items</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder={"Add item"}
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="flex-1"
            maxLength={50}
          />
          <CurrencyInput
            placeholder="Price"
            value={newItem.price}
            onChange={(value) => setNewItem({ ...newItem, price: value })}
            className="w-24"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={handleAddItem}
            disabled={!newItem.name}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      <ScrollArea className="w-full">
        <div className="flex flex-col gap-y-4">
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
