import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";

type Bill = Database["public"]["Tables"]["bills"]["Row"];
type BillParticipant = Database["public"]["Tables"]["bill_participants"]["Row"];
type BillItem = Database["public"]["Tables"]["bill_items"]["Row"];
type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

export interface FormattedBill extends Bill {
  participants: (BillParticipant & {
    profile?: UserProfile;
  })[];
  items: (BillItem & {
    assignedTo: Array<{
      participantId: string;
      portions: number;
    }>;
  })[];
}

export interface BillSummary {
  id: string;
  title: string;
  updated_at: string;
  participant_count: number;
  total_amount: number;
}

export const api = {
  async getBill(id: string): Promise<FormattedBill> {
    const { data: bill, error: billError } = await supabase
      .from("bills")
      .select(
        `
        *,
        participants:bill_participants(*, profile:user_profiles(*)),
        items:bill_items(*)
      `,
      )
      .eq("id", id)
      .single();

    if (billError) throw billError;
    if (!bill) throw new Error("Bill not found");

    return bill;
  },

  async getUserBills(): Promise<BillSummary[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("Not authenticated");

    const { data: bills, error } = await supabase
      .from("bills")
      .select(
        `
        id,
        title,
        updated_at,
        created_at,
        created_by,
        total_amount,
        bill_participants (id)
      `,
      )
      .or(`created_by.eq.${user.id},bill_participants.user_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return (bills || []).map((bill: any) => ({
      id: bill.id,
      title: bill.title,
      updated_at: bill.updated_at || bill.created_at,
      participant_count: bill.bill_participants?.length || 0,
      total_amount: bill.total_amount || 0,
    }));
  },

  async updateBill(id: string, updates: Partial<Bill>): Promise<void> {
    const { error } = await supabase.from("bills").update(updates).eq("id", id);
    if (error) throw error;
  },

  async addParticipant(
    billId: string,
    name: string,
    emojiName: string,
    profileId?: string,
  ): Promise<void> {
    const { error } = await supabase.from("bill_participants").insert({
      bill_id: billId,
      name,
      emoji_name: emojiName,
      profile_id: profileId,
    });
    if (error) throw error;
  },

  async removeParticipant(participantId: string): Promise<void> {
    const { error } = await supabase
      .from("bill_participants")
      .delete()
      .eq("id", participantId);
    if (error) throw error;
  },

  async addItem(
    billId: string,
    item: { name: string; price: number },
  ): Promise<void> {
    const { error } = await supabase.from("bill_items").insert({
      bill_id: billId,
      ...item,
    });
    if (error) throw error;
  },

  async updateItem(
    itemId: string,
    updates: { name: string; price: number },
  ): Promise<void> {
    const { error } = await supabase
      .from("bill_items")
      .update(updates)
      .eq("id", itemId);
    if (error) throw error;
  },

  async deleteItem(itemId: string): Promise<void> {
    const { error } = await supabase
      .from("bill_items")
      .delete()
      .eq("id", itemId);
    if (error) throw error;
  },

  async assignItem(
    itemId: string,
    participantId: string,
    portions: number = 1,
  ): Promise<void> {
    if (portions === 0) {
      // Delete assignment
      const { error } = await supabase
        .from("item_assignments")
        .delete()
        .eq("item_id", itemId)
        .eq("participant_id", participantId);
      if (error) throw error;
    } else {
      // Upsert assignment
      const { error } = await supabase.from("item_assignments").upsert(
        {
          item_id: itemId,
          participant_id: participantId,
          portions,
        },
        {
          onConflict: "item_id,participant_id",
        },
      );
      if (error) throw error;
    }
  },
};
