'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // In a real implementation, you would check auth status here
    // For now, just redirect to login
    router.push('/admin/login');
  }, []);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Redirecting...</p>
    </div>
  );
}