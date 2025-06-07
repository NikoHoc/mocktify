import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function useSpotifyToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken = session?.provider_token;
      setToken(accessToken ?? null);
    };

    getToken();
  }, []);

  return token;
}
