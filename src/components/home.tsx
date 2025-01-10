import React from "react";
import { useBill } from "@/hooks/useBill";
import ReceiptHeader from "./receipt/ReceiptHeader";
import ItemizedList from "./receipt/ItemizedList";
import ParticipantList from "./receipt/ParticipantList";
import BillTotals from "./receipt/BillTotals";
import ParticipantSummaries from "./receipt/ParticipantSummaries";
import type { Bill } from "@/types/bill";

interface BillEditorProps {
  initialBill: Bill;
}

const BillEditor = ({ initialBill }: BillEditorProps) => {
  const {
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
  } = useBill(initialBill);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-extrabold tracking-tight lg:text-2xl">
          Totali
        </h2>
        <ReceiptHeader
          title={bill.title}
          shareUrl={bill.shareUrl}
          onTitleChange={(title) => updateBill({ title })}
        />
        <ParticipantList
          participants={bill.participants}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
        />
        <ItemizedList
          items={bill.items}
          participants={bill.participants}
          onItemAssign={assignItemToParticipant}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
        />
        <BillTotals
          subtotal={summary.subtotal}
          tax={summary.tax}
          tip={summary.tip}
          tipPercentage={bill.tip.percentage}
          onTaxChange={(value) => updateTax(value)}
          onTipChange={(value, percentage) => updateTip(value, percentage)}
        />
        <ParticipantSummaries
          participants={bill.participants}
          items={bill.items}
          tax={summary.tax}
          tip={summary.tip}
        />
      </div>
    </div>
  );
};

export default BillEditor;
