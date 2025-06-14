"use client";

import { useState, useEffect } from "react";
import PlaylistTable from "@/components/PlaylistTable";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { Spinner } from "flowbite-react";

interface Playlist {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  user_id: string;
  created_at: string;
}

export default function Playlist() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  // Removed unused setBackgroundColor state to fix eslint warning
  const [showMenu, setShowMenu] = useState(false);

  // Fetch playlist data from supabase
  useEffect(() => {
    async function fetchPlaylistDetails() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("playlist")
          .select("*")
          .eq("id", playlistId)
          .single();

        if (error) throw error;

        if (data) {
          setPlaylist(data);
          setEditName(data.name);
          setEditDescription(data.description || "");
        } else {
          setError("Playlist not found");
        }
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setError("Failed to load playlist");
      } finally {
        setLoading(false);
      }
    }

    if (playlistId) {
      fetchPlaylistDetails();
    }
  }, [playlistId]);

  // Handle save button click
  const handleSaveDetails = async () => {
    if (!playlist) return;

    try {
      const { error } = await supabase
        .from("playlist")
        .update({
          name: editName,
          description: editDescription || null,
        })
        .eq("id", playlistId);

      if (error) throw error;

      setPlaylist({
        ...playlist,
        name: editName,
        description: editDescription,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating playlist:", err);
    }
  };

  // Handle delete playlist
    const handleDeletePlaylist = async () => {
    if (!playlist) return;
    
    if (!confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      
      // First delete all songs in this playlist
      const { error: songDeleteError } = await supabase
        .from("song")
        .delete()
        .eq("playlist_id", playlistId);
        
      if (songDeleteError) throw songDeleteError;
      
      // Then delete the playlist
      const { error: playlistDeleteError } = await supabase
        .from("playlist")
        .delete()
        .eq("id", playlistId);
        
      if (playlistDeleteError) throw playlistDeleteError;
      
      // Redirect to home page instead of playlist page
      router.push("/");
      
    } catch (err) {
      console.error("Error deleting playlist:", err);
      alert("Failed to delete playlist. Please try again.");
      setLoading(false);
    }
  };

  // Handle image upload and extract dominant color
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !playlist) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();

      if (result.playlist && result.playlist.image) {
        setPlaylist({
          ...playlist,
          image: result.playlist.image,
        });
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">{error || "Playlist not found"}</h1>
        <p className="mt-4">
          The playlist you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="bg-gradient-to-b from-[#567C8D] to-gray-900 p-8 rounded-lg mb-8 text-white">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Playlist Image */}
          <div className="relative w-48 h-48 flex-shrink-0 bg-gray-700 rounded-md shadow-lg">
            {playlist.image ? (
              <img
                src={playlist.image}
                alt="Playlist Cover"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
            )}

            {/* Upload Button */}
            <label
              htmlFor="playlist-image"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-md"
            >
              <span className="text-white text-sm font-medium">Upload Image</span>
              <input
                id="playlist-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

         {/* Playlist Information */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <p className="text-sm uppercase font-semibold">PLAYLIST</p>
              
              {/* Three dots menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:text-gray-300 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
                    <button 
                      onClick={handleDeletePlaylist}
                      className="w-full text-left block px-4 py-2 text-gray-200 hover:text-red-500"
                    >
                      Delete Playlist
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-3 mt-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-3xl font-bold bg-transparent border-b border-white w-full focus:outline-none"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="text-gray-300 bg-transparent border border-gray-600 rounded p-2 w-full focus:outline-none"
                  rows={2}
                ></textarea>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveDetails}
                    className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(playlist.name);
                      setEditDescription(playlist.description || "");
                    }}
                    className="px-4 py-2 bg-gray-700 rounded-full text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-5xl font-bold mt-2 mb-4">{playlist.name}</h1>
                {playlist.description && (
                  <p className="text-gray-300 mb-4">{playlist.description}</p>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-transparent border border-white rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors"
                >
                  Edit Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PlaylistTable playlistId={playlistId} />
    </div>
  );
}
