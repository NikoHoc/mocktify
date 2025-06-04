"use client";

import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Dropdown, DropdownItem } from "flowbite-react";
import { useEffect, useState } from "react";
import { supabase } from '../app/lib/supabaseClient';
import { useRouter } from "next/navigation";
import { User } from '@supabase/supabase-js';


export function UserNavbar() {

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
      }

      // Optional: Listen for login/logout events
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setUser(session?.user ?? null);
        }
      );

      return () => {
        listener?.subscription.unsubscribe();
      };
    };

    getUser();
  }, []);

  const handleLogin = () => {
    router.push("/sign-in");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/")
  }

  return (
    <Navbar className="px-5 py-5" fluid>
      <NavbarBrand href="/">
        <span className="px-2 self-center whitespace-nowrap text-4xl font-bold text-white">
          Mocktify
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink href="/" className="font-semibold text-xl">
          Home
        </NavbarLink>
        {/* Munculkan fitur untuk user yang logged in */}
        {user && (
          <NavbarLink href="/playlist" className="font-semibold text-xl">
            Playlist
          </NavbarLink>
        )}

        {/* pengecekan untuk button sign in atau sign out */}
        {user ? (
          <Dropdown
            label={user.email || "User"}
            dismissOnClick={false}
            size="sm"
            
          >
            <DropdownItem
              className="!bg-red-600 font-extrabold rounded-lg"
              onClick={handleLogout}
            >
              Sign out
            </DropdownItem>
          </Dropdown>
        ) : (
          <Button
            size="sm"
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
