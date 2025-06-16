"use client";

import React, { useState, useEffect } from "react";
import SongList from "@/components/SongList";
import SongGuest from "@/components/SongGuest";
import AddPlaylistModal from "@/components/AddPlaylistModal";
import NowPlaying from "@/components/NowPlaying";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import TestPlaying from "@/components/TestPlaying";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import { signInWithSpotify } from "../lib/auth";
import getSpotifyProfile from "../lib/spotifyProfile";
import MainSlideShow from "@/components/MainSlideShow";

interface Playlist {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  created_at: string;
}

export default function Home() {
  const { spotifyProfile, loading } = getSpotifyProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && session.user) {
        setIsUserLoggedIn(true);
        setUserId(session.user.id);
      } else {
        setIsUserLoggedIn(false);
        setUserId(null);
      }
    };
    getSession();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!userId) {
        setPlaylists([]);
        return;
      }
      const { data, error } = await supabase
        .from("playlist")
        .select("id, name, description, image, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching playlists:", error);
      } else {
        setPlaylists(data || []);
      }
    };
    fetchPlaylists();
  }, [userId]);

  console.log(spotifyProfile)
  if (isUserLoggedIn && (loading || !spotifyProfile)) {
    return <div className="mt-4">Loading your profile...</div>;
  }
  
  const handleCreatePlaylist = async (playlist: {
    name: string;
    description?: string;
    imageFile?: File;
    user_id: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", playlist.name);
      if (playlist.description) {
        formData.append("description", playlist.description);
      }
      formData.append("user_id", playlist.user_id);
      if (playlist.imageFile) {
        formData.append("image", playlist.imageFile);
      }

      const response = await fetch("/api/playlists", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Unknown error";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || JSON.stringify(errorData);
        } catch {
          // ignore JSON parse errors
        }
        console.error("Error creating playlist:", errorMessage);
        return;
      }

      const data = await response.json();
      if (data.playlist) {
        setPlaylists((prev) => [data.playlist, ...prev]);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const openAddToPlaylistModal = (songId: string) => {
    setSelectedSongId(songId);
    setIsAddModalOpen(true);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!selectedSongId) return;

    const { data: existing } = await supabase
      .from("song")
      .select("id")
      .eq("song_id", selectedSongId)
      .eq("playlist_id", playlistId)
      .single();

    if (existing) {
      alert("Lagu sudah ada di playlist ini.");
      return;
    }

    const { error } = await supabase.from("song").insert([
      {
        song_id: selectedSongId,
        playlist_id: playlistId,
      },
    ]);
    if (error) {
      console.error("Failed to add song:", error.message);
    }
    setIsAddModalOpen(false);
    setSelectedSongId(null);
  };

return (
  <>
    {isUserLoggedIn ? (
      <div className="flex flex-col md:flex-row h-screen">
        {/* KIRI */}
        <div className="w-full md:w-2/3 lg:w-3/4 p-6 overflow-y-auto hide-scrollbar">
          <MainSlideShow />
          {isPlaying && (
            <div className="block md:hidden my-4">
              <NowPlaying isPlaying={isPlaying} />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 mt-8">
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-lg shadow p-4 h-full border border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Your Playlists</h2>
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center rounded-md bg-[#C8D9E6] hover:bg-[#567C8D] px-3 py-0.5 text-[#2F4156] hover:text-[#F5EFEB] cursor-pointer transition"
                  >
                    Add
                  </div>
                </div>
                {playlists.length === 0 ? (
                  <p className="text-gray-600">No playlists found.</p>
                ) : (
                  <ul className="space-y-3">
                    {playlists.map((playlist) => (
                      <li
                        key={playlist.id}
                        className="hover:bg-blue-100 rounded p-2 transition"
                      >
                        <Link
                          href={`/playlist/${playlist.id}`}
                          className="flex items-center space-x-4 w-full cursor-pointer"
                        >
                          {playlist.image ? (
                            <img
                              src={playlist.image}
                              alt={playlist.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-300"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 text-xl">
                              🎵
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{playlist.name}</div>
                            {playlist.description && (
                              <div className="text-sm text-gray-500">{playlist.description}</div>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Kanan: Songlist */}
            <div className="w-full lg:w-3/4 mt-6 lg:mt-0">
              <div className="flex-1 mx-4 overflow-y-auto h-full">
                <div className="flex items-center justify-center">
                  <h1 className="text-2xl font-bold">New Release Song</h1>
                  
                </div>
                <div className="mt-4 mb-5">
                  <input
                    type="text"
                    placeholder="Search songs by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                  />
                  <SongList
                    onAddToPlaylist={openAddToPlaylistModal}
                    searchQuery={searchQuery}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KANAN  */}
        <div className="hidden md:block w-full md:w-1/3 lg:w-1/4 bg-transparent pt-6 pr-6 overflow-y-auto">
          <div className="sticky top-0 bg-transparent z-10">
            {isUserLoggedIn && (
              <NowPlaying isPlaying={isPlaying} />
            )}
          </div>
        </div>
      </div>
    ) : (
      // Halaman untuk user yang belum login
      <section>
        <div
          className="w-full h-120 bg-cover bg-center text-white flex flex-col items-center justify-center text-center px-4"
          style={{ backgroundImage: "url('/headphone.jpg')" }}
        >
          <h1 className="text-4xl font-bold italic text-[#ECF0F1]">MOCKTIFY</h1>
          <p className="text-lg italic font-normal text-[#ECF0F1]">
            Keep up with your favorite songs through Mocktify
          </p>
          
        </div>
        <div className="m-5">
          <div className="justify-center flex text-center mb-5">
            <h1 className="text-2xl font-bold">New Release Song</h1>
            <p className="cursor-pointer text-sm italic font-thin hover:text-blue-500 mt-3 ms-2" onClick={signInWithSpotify}>
            *sign in to create playlist
            </p>
          </div>
          <SongGuest/>
        </div>
      </section>
      
      
    )}

    {isUserLoggedIn && (
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg border-t border-gray-200 py-2 px-4 z-50">
        <TestPlaying setIsPlaying={setIsPlaying} />
      </div>
    )}

    <AddPlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(playlist) => {
          if (userId) {
            handleCreatePlaylist({ ...playlist, user_id: userId });
          } else {
            console.warn("User ID not found. Cannot create playlist.");
          }
        }}
      />
      <AddToPlaylistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        playlists={playlists}
        onAdd={handleAddToPlaylist}
      />
  </>
);


  }