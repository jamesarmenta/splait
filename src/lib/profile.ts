import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const profileApi = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return profile;
  },

  async updateProfile(
    userId: string,
    updates: Partial<Profile>,
  ): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId);

    if (error) throw error;
  },

  async createProfile(profile: {
    user_id: string;
    name: string;
    emoji_name: string;
  }): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
