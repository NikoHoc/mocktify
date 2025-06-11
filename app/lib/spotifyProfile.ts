import { useEffect, useState } from "react";
import useSpotifySession from "./spotifySession"; // ganti dari supabase langsung ke custom hook

export default function useSpotifyProfile() {
  const { accessToken, isLoading: loadingToken } = useSpotifySession();
  const [spotifyProfile, setSpotifyProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setLoadingProfile(false);
      return;
    }

    const fetchSpotifyProfile = async () => {
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
      setLoadingProfile(false);
    };

    fetchSpotifyProfile();
  }, [accessToken]);

  return { spotifyProfile, loading: loadingToken || loadingProfile };
}
