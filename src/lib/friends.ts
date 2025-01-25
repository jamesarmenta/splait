import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
type Friendship = Database["public"]["Tables"]["friendships"]["Row"];

export interface FriendWithProfile extends Friendship {
  friend: UserProfile;
}

export const friendsApi = {
  async getFriends(): Promise<FriendWithProfile[]> {
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error("No profile found");

    const { data: friends, error } = await supabase
      .from("friendships")
      .select(
        `
        *,
        friend:user_profiles!friendships_friend_id_fkey(*)
      `,
      )
      .or(`user_id.eq.${profile.id},friend_id.eq.${profile.id}`)
      .eq("status", "accepted");

    if (error) throw error;
    return friends || [];
  },

  async getPendingRequests(): Promise<FriendWithProfile[]> {
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error("No profile found");

    const { data: requests, error } = await supabase
      .from("friendships")
      .select(
        `
        *,
        friend:user_profiles!friendships_friend_id_fkey(*)
      `,
      )
      .eq("friend_id", profile.id)
      .eq("status", "pending");

    if (error) throw error;
    return requests || [];
  },

  async sendFriendRequest(friendId: string): Promise<void> {
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error("No profile found");

    const { error } = await supabase.from("friendships").insert({
      user_id: profile.id,
      friend_id: friendId,
      status: "pending",
    });

    if (error) throw error;
  },

  async acceptFriendRequest(friendshipId: string): Promise<void> {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);

    if (error) throw error;
  },

  async removeFriend(friendshipId: string): Promise<void> {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);

    if (error) throw error;
  },

  async searchUsers(query: string): Promise<UserProfile[]> {
    const { data: users, error } = await supabase
      .from("user_profiles")
      .select("*")
      .ilike("name", `%${query}%`)
      .limit(10);

    if (error) throw error;
    return users || [];
  },
};
