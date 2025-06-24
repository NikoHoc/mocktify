'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { adminSignOut } from "../lib/auth";
import { PropsWithChildren } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

const publicRoutes = ['/sign-in'];

export default function AdminLayout({ children }: PropsWithChildren<{}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user && !publicRoutes.includes(pathname)) {
        router.push('/sign-in');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white flex items-center justify-center h-screen">
        <p className="text-xl">Checking Session</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 overflow-y-auto">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-6">Mocktify Admin</h1>
          
          <nav className="space-y-1">
            <NavLink href="/admin/dashboard" current={pathname === '/admin/dashboard'}>
              Dashboard
            </NavLink>
            
            <NavLink href="/admin/users" current={pathname === '/admin/users'}>
              Users
            </NavLink>
            
            <NavLink href="/admin/review" current={pathname === '/admin/review'}>
              Reviews
            </NavLink>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-4">
          <button onClick={() => adminSignOut(router)} className="flex items-center text-gray-400 hover:text-white hover:bg-red-500 transition ease-in rounded-lg w-full px-3 py-2">    
            <span>Log out</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-950">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type NavLinkProps = {
  href: string;
  current: boolean;
  children: ReactNode;
};

function NavLink({ href, current, children }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={`flex items-center px-3 py-2 rounded-md ${
        current 
          ? 'bg-gray-800 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );
}