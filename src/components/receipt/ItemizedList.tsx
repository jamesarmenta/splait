import React, { useState } from "react";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [editItem, setEditItem] = useState({ name: "", price: "" });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    onAddItem({
      name: newItem.name,
      price: parseFloat(newItem.price),
    });
    setNewItem({ name: "", price: "" });
  };

  const startEditing = (item: ReceiptItem) => {
    setEditingId(item.id);
    setEditItem({ name: item.name, price: item.price.toString() });
  };

  const handleUpdateItem = (id: string) => {
    if (!editItem.name || !editItem.price) return;
    onUpdateItem(id, {
      name: editItem.name,
      price: parseFloat(editItem.price),
    });
    setEditingId(null);
  };

  return (
    <Card className="w-full h-full bg-white p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Item name"
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
      <ScrollArea className="h-[600px] w-full pr-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="relative">
              {editingId === item.id ? (
                <div className="flex items-center gap-2 p-4 border rounded-lg bg-white">
                  <Input
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editItem.price}
                    onChange={(e) =>
                      setEditItem({ ...editItem, price: e.target.value })
                    }
                    className="w-24"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleUpdateItem(item.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <ReceiptItem
                    {...item}
                    participants={participants}
                    onAssign={onItemAssign}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ItemizedList;
