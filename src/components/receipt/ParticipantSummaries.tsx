import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEmojiByName } from "@/lib/emoji";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmojiName } from "@/lib/emoji";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: Array<{
    participantId: string;
    portions: number;
  }>;
}

interface Participant {
  id: string;
  name: string;
  emojiName: EmojiName;
  hasPaid?: boolean;
}

interface ParticipantSummariesProps {
  participants: Participant[];
  items: ReceiptItem[];
  tax: number;
  tip: number;
  onParticipantPaidChange?: (participantId: string, hasPaid: boolean) => void;
}

const ParticipantSummary = ({
  participant,
  items,
  tax,
  tip,
  participantTotal,
  participantTax,
  participantTip,
  total,
  onPaidChange,
}: {
  participant: Participant;
  items: Array<{
    name: string;
    portions: number;
    totalPortions: number;
    amount: number;
  }>;
  tax: number;
  tip: number;
  participantTotal: number;
  participantTax: number;
  participantTip: number;
  total: number;
  onPaidChange: (hasPaid: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col p-4 rounded-lg bg-card shadow-sm justify-between">
      <div className="flex text-lg items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
            {getEmojiByName(participant.emojiName)}
          </div>
          <span className="font-medium text-foreground">
            {participant.name}
          </span>
        </div>
        <span className="font-semibold text-foreground font-title">
          ${total.toFixed(2)}
        </span>
      </div>
      {isExpanded && (
        <div className="pb-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-xs text-muted-foreground"
            >
              <span className="truncate mr-2">
                {item.name}
                {item.totalPortions > 1 && (
                  <span className="text-xs text-muted-foreground/70 ml-1">
                    ({item.portions}/{item.totalPortions} portions)
                  </span>
                )}
              </span>
              <span>${item.amount.toFixed(2)}</span>
            </div>
          ))}
          {(participantTax > 0 || participantTip > 0) && (
            <>
              <Separator className="my-1" />
              <div className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${participantTotal.toFixed(2)}</span>
                </div>
                {participantTax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${participantTax.toFixed(2)}</span>
                  </div>
                )}
                {participantTip > 0 && (
                  <div className="flex justify-between">
                    <span>Tip</span>
                    <span>${participantTip.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      <div className="flex gap-2 justify-between items-center">
        <Button
          variant="clickable"
          size="xs"
          className="h-7 gap-1 grow"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <>Hide details</> : <>Show details</>}
        </Button>
        <Button
          variant={participant.hasPaid ? "default" : "clickable"}
          size="xs"
          className="h-7 gap-1 grow"
          onClick={() => onPaidChange(!participant.hasPaid)}
        >
          {participant.hasPaid && <Check className="h-3 w-3" />}
          {participant.hasPaid ? "Paid" : "Mark as Paid"}
        </Button>
      </div>
    </div>
  );
};

const ParticipantSummaries = ({
  participants,
  items,
  tax,
  tip,
  onParticipantPaidChange,
}: ParticipantSummariesProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  // Check for unallocated items
  const unallocatedItems = items.filter((item) => item.assignedTo.length === 0);
  const hasUnallocatedItems = unallocatedItems.length > 0;

  const getParticipantItems = (participantId: string) => {
    return items
      .filter((item) =>
        item.assignedTo.some((a) => a.participantId === participantId),
      )
      .map((item) => {
        const assignment = item.assignedTo.find(
          (a) => a.participantId === participantId,
        );
        const totalPortions = item.assignedTo.reduce(
          (sum, a) => sum + a.portions,
          0,
        );
        const portions = assignment?.portions || 0;
        const amount =
          totalPortions > 0 ? (item.price * portions) / totalPortions : 0;

        return {
          name: item.name,
          portions,
          totalPortions,
          amount,
        };
      });
  };

  const getParticipantTotal = (participantId: string) => {
    const items = getParticipantItems(participantId);
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const getParticipantShare = (participantTotal: number) => {
    if (subtotal === 0) return 0;
    return participantTotal / subtotal;
  };

  return (
    <ScrollArea className="">
      {hasUnallocatedItems && (
        <div className="mb-4 p-3 bg-yellow-500/10 border-l-4 border-yellow-500 rounded flex items-center gap-2 text-sm text-yellow-700">
          <div>
            <span className="font-medium">Heads up! Unallocated items:</span>{" "}
            {unallocatedItems.map((item) => item.name).join(", ")}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {participants.map((participant) => {
          const participantItems = getParticipantItems(participant.id);
          const participantTotal = getParticipantTotal(participant.id);
          const sharePercentage = getParticipantShare(participantTotal);
          const participantTax = tax * sharePercentage;
          const participantTip = tip * sharePercentage;
          const total = participantTotal + participantTax + participantTip;

          return (
            <ParticipantSummary
              key={participant.id}
              participant={participant}
              items={participantItems}
              tax={tax}
              tip={tip}
              participantTotal={participantTotal}
              participantTax={participantTax}
              participantTip={participantTip}
              total={total}
              onPaidChange={(hasPaid) =>
                onParticipantPaidChange?.(participant.id, hasPaid)
              }
              className=""
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ParticipantSummaries;
