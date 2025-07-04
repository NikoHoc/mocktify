"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { supabase } from "../app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { signInWithSpotify, signOut } from "../app/lib/auth";
import getSpotifyProfile from "../app/lib/spotifyProfile";


export function UserNavbar() {
  const { spotifyProfile, loading } = getSpotifyProfile();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
      }

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (user) {
    if (loading) return <div>Loading Profile...</div>;
  }

  return (
    <Navbar
      fluid
      className={`px-4 py-3 fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#567C8D]/80 backdrop-blur-md shadow-md"
          : "bg-[#567C8D]"
      }`}
    >
      <div className="w-full flex flex-wrap items-center justify-between px-8">
        <NavbarBrand href="/">
          <span className="self-center whitespace-nowrap text-2xl font-bold text-[#F5EFEB]">
            Mocktify
          </span>
        </NavbarBrand>

        <NavbarToggle
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-[#F5EFEB]"
        />

        <NavbarCollapse className={`${isMenuOpen ? "block" : "hidden"} w-full md:flex md:items-center md:w-auto`}>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-x-8 mt-4 md:mt-0">
            <NavbarLink
              href="/"
              className="font-semibold text-lg text-[#F5EFEB] hover:!text-[#F5EFEB]"
            >
              Home
            </NavbarLink>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-[150px] rounded-md bg-[#F5EFEB] px-4 py-2 text-sm font-semibold text-[#567C8D] hover:brightness-110"
                >
                  {spotifyProfile?.display_name ?? "Spotify User"}
                </button>

                {showDropdown && (
                  <div className="absolute left-0 top-full mt-2 w-[150px] rounded-md bg-[#3E5A6C] shadow-lg z-50">
                    <button
                      onClick={() => signOut(router)}
                      className="bg-gray-700 block rounded-md w-full px-4 py-2 text-sm text-[#F5EFEB] hover:text-[#FFFFFF] hover:font-bold  text-left"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithSpotify}
                className="w-[150px] rounded-md bg-[#F5EFEB] px-4 py-2 text-sm font-semibold text-[#567C8D] hover:brightness-110"
              >
                Sign In
              </button>
            )}
          </div>
        </NavbarCollapse>
      </div>
    </Navbar>
  );
}
