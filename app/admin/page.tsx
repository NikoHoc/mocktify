'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/sign-in');
      } else {
        router.push('/admin/dashboard');
      }
    };

    checkAuth();
  }, [router]);
  
  return (
    <div className="bg-gray-900 text-white flex items-center justify-center h-screen">
      <p className="text-xl">Checking Session</p>
    </div>
  );
}