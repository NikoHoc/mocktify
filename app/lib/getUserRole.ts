import { supabase } from "./supabaseClient";

export async function getUserRole(): Promise<"admin" | "spotify" | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !data) return null;
  return data.role as "admin" | "spotify";
}
