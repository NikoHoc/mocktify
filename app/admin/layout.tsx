'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Skip layout for login page
const publicRoutes = ['/admin/login'];

import { PropsWithChildren } from 'react';

export default function AdminLayout({ children }: PropsWithChildren<{}>) {
  const pathname = usePathname();
  
  // For login page, render without admin layout
  if (publicRoutes.includes(pathname)) {
    return children;
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
          <button className="flex items-center text-gray-400 hover:text-white w-full px-3 py-2">    
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