import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function useSpotifyProfile() {
  const [spotifyProfile, setSpotifyProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotifyProfile = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken = session?.provider_token;
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const profile = await res.json();
        setSpotifyProfile(profile);
      } catch (error) {
        console.error("Failed to fetch Spotify profile:", error);
      }
      setLoading(false);
    };

    fetchSpotifyProfile();
  }, []);

  return { spotifyProfile, loading };
}
