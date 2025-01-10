import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBill } from "@/hooks/useBill";
import { createNewBill } from "@/types/bill";
import BillEditor from "@/components/home";

export default function BillPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = React.useState(() => {
    if (!id) {
      navigate("/");
      return createNewBill();
    }

    // In a real app, we'd fetch this from a backend
    const bills = JSON.parse(localStorage.getItem("bills") || "[]");
    const existingBill = bills.find((b) => b.id === id);

    if (!existingBill) {
      // If bill doesn't exist, create a new one with the given ID
      const newBill = createNewBill();
      newBill.id = id;
      return newBill;
    }

    return existingBill;
  });

  // Save bill changes to localStorage
  React.useEffect(() => {
    const bills = JSON.parse(localStorage.getItem("bills") || "[]");
    const index = bills.findIndex((b) => b.id === bill.id);

    if (index >= 0) {
      bills[index] = bill;
    } else {
      bills.push(bill);
    }

    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bill]);

  return <BillEditor initialBill={bill} />;
}
