import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  ChevronRight,
  Trash2,
  Pencil,
  Shuffle,
  Camera,
} from "lucide-react";
import { createNewBill } from "@/types/bill";
import { api } from "@/lib/api";
import { userStorage, EMOJI_NAMES } from "@/lib/user";
import { getEmojiByName } from "@/lib/emoji";
import type { Bill } from "@/types/bill";
import type { User } from "@/lib/user";
import ItemizedList from "./../components/receipt/ItemizedList.tsx";
import type { EmojiName } from "@/lib/emoji";

const JOIN_EMOJI_OPTIONS: EmojiName[] = [
  "heart",
  "apple",
  "rainbow",
  "pizza",
  "happy",
  "baloon",
  "star",
  "tree",
  "fire",
];

const getRandomEmojis = (count: number) => {
  const shuffled = [...EMOJI_NAMES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default function HomePage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = React.useState(false);
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(() =>
    userStorage.getUser(),
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [selectedEmojiName, setSelectedEmojiName] = React.useState<EmojiName>(
    EMOJI_NAMES[0],
  );
  const [displayedEmojis, setDisplayedEmojis] = React.useState<EmojiName[]>(
    getRandomEmojis(12),
  );
  const [selectedJoinEmojis, setSelectedJoinEmojis] = React.useState<
    EmojiName[]
  >([]);

  const regenerateEmojis = () => {
    setDisplayedEmojis(getRandomEmojis(12));
  };

  const loadBills = React.useCallback(async () => {
    try {
      const loadedBills = await api.listBills();
      setBills(loadedBills);
    } catch (err) {
      setError("Failed to load bills");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBills();
  }, [loadBills]);

  const handleCreateBill = async () => {
    if (!user) {
      alert("Please set your name first");
      return;
    }

    try {
      setIsCreating(true);
      const newBill = createNewBill();
      // Add the current user as the first participant
      newBill.participants = [
        {
          id: crypto.randomUUID(),
          name: user.name,
          emojiName: user.emojiName,
        },
      ];
      await api.createBill(newBill);
      navigate(`/bills/${newBill.id}`);
    } catch (err) {
      console.error("Failed to create bill:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please set your name first");
      return;
    }

    if (selectedJoinEmojis.length !== 3) return;

    // TODO: Convert emoji combination to bill ID
    const mockBillId = selectedJoinEmojis.join("-");
    navigate(`/bills/${mockBillId}`);
  };

  const handleDeleteBill = async (e: React.MouseEvent, billId: string) => {
    e.stopPropagation();
    try {
      await api.deleteBill(billId);
      await loadBills();
    } catch (err) {
      console.error("Failed to delete bill:", err);
    }
  };

  const handleStartEdit = () => {
    if (user) {
      setUserName(user.name);
      setSelectedEmojiName(user.emojiName);
      setIsEditing(true);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    const newUser = userStorage.setUser(userName.trim(), selectedEmojiName);
    setUser(newUser);
    setIsEditing(false);
    setUserName("");
  };

  const handleJoinEmojiClick = (emojiName: EmojiName) => {
    if (selectedJoinEmojis.includes(emojiName)) {
      setSelectedJoinEmojis(selectedJoinEmojis.filter((e) => e !== emojiName));
    } else if (selectedJoinEmojis.length < 3) {
      setSelectedJoinEmojis([...selectedJoinEmojis, emojiName]);
    }
  };

  const handleBackspace = () => {
    setSelectedJoinEmojis(selectedJoinEmojis.slice(0, -1));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-title">Totali</h1>
          <p className="text-muted-foreground">Split, tap, done</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold font-title flex items-center gap-2">
              You
            </h2>
            {user && !isEditing ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-3xl">
                    {getEmojiByName(user.emojiName)}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">
                      This name will be used when joining bills
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartEdit}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={"default"}
                    className="w-12 h-12 p-0 text-3xl"
                  >
                    {getEmojiByName(selectedEmojiName)}
                  </Button>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <Button type="submit" disabled={!userName.trim()}>
                    Save
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {displayedEmojis.map((emojiName) => (
                      <Button
                        key={emojiName}
                        type="button"
                        variant={
                          selectedEmojiName === emojiName
                            ? "default"
                            : "clickable"
                        }
                        className="w-10 h-10 p-0 text-xl"
                        onClick={() => setSelectedEmojiName(emojiName)}
                      >
                        {getEmojiByName(emojiName)}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={regenerateEmojis}
                      className="w-10 h-10 p-0 text-xl"
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold font-title">Start a Bill</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              onClick={handleCreateBill}
              className="h-16 text-lg"
              variant="clickable"
              size="lg"
              disabled={isCreating || !user}
            >
              <Plus className="mr-2 h-5 w-5" />
              <div className="flex flex-col items-start text-left">
                <span className="text-base">Start from Scratch</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-16 text-lg"
              size="lg"
              disabled={true}
              title="Coming soon!"
            >
              <Camera className="mr-2 h-5 w-5" />
              <div className="flex flex-col items-start text-left">
                <span className="text-base">Start from Photo</span>
                <span className="text-xs text-muted-foreground">
                  Coming soon
                </span>
              </div>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <form onSubmit={handleJoinBill} className="space-y-4">
            <h2 className="text-lg font-semibold font-title">Join a Bill</h2>
            <div className="space-y-4 flex flex-col items-center">
              <div className="flex items-center gap-4 justify-center mb-2 w-full">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="w-full h-16 rounded-lg bg-gray-100 flex items-center justify-center text-3xl"
                  >
                    {selectedJoinEmojis[index] ? (
                      getEmojiByName(selectedJoinEmojis[index])
                    ) : (
                      <span className="text-muted-foreground text-sm"></span>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {JOIN_EMOJI_OPTIONS.map((emojiName) => (
                  <Button
                    key={emojiName}
                    type="button"
                    variant=""
                    className="w-full h-16 p-0 text-3xl bg-gray-200"
                    onClick={() => handleJoinEmojiClick(emojiName)}
                  >
                    {getEmojiByName(emojiName)}
                  </Button>
                ))}
              </div>
              <Button
                type="button"
                variant=""
                className="w-full bg-gray-200"
                disabled={selectedJoinEmojis.length === 0}
                onClick={handleBackspace}
              >
                Backspace
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-title">Recent Bills</h2>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading bills...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : bills.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No bills yet. Create your first bill to get started!
            </Card>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {bills.map((bill) => (
                  <Card
                    key={bill.id}
                    className="p-4 hover:bg-accent transition-colors cursor-pointer group"
                    onClick={() => navigate(`/bills/${bill.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium font-title">{bill.title}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {bill.participants.map((participant) => (
                              <div
                                key={participant.id}
                                className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm ring-2 ring-background"
                                title={participant.name}
                              >
                                {getEmojiByName(participant.emojiName)}
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            · {formatDate(bill.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                          onClick={(e) => handleDeleteBill(e, bill.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
      <ItemizedList />
    </div>
  );
}
