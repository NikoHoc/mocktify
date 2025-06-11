import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function useSpotifySession() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted) {
        setAccessToken(session?.provider_token ?? null);
        setIsLoading(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
            const {
                data: { session: updatedSession },
            } = await supabase.auth.getSession();
            setAccessToken(updatedSession?.provider_token ?? null);
        }

        if (event === "SIGNED_OUT") {
          setAccessToken(null);
        }
      }
    );

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { accessToken, isLoading };
}
