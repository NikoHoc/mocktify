import { useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";

export async function signInWithSpotify() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
        scopes: "user-read-email user-read-private streaming user-modify-playback-state user-read-playback-state",
        redirectTo: 'http://localhost:3000/home',
    },
  });

  if (error) {
    console.error("Spotify login failed:", error.message);
    throw error;
  }

  return data;
}

export async function signOut(router: ReturnType<typeof useRouter>) {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Spotify logout failed:", error.message);
    throw error;
  }
  
  router.push("/sign-in");

  //window.location.reload();
}