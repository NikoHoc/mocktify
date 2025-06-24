"use client";

import { supabase } from "@/app/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";

interface PlaylistTableProps {
  playlistId?: string;
}

const PlaylistTable = ({ playlistId }: PlaylistTableProps) => {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
          if (playlistId) {
            try {
              const { data, error } = await supabase
                .from("song")
                .select("song_id, created_at")
                .eq("playlist_id", playlistId);

              if (error) throw error;

              if (data && data.length > 0) {
                const fetchSongs = async () => {
                  const res = await fetch("/api/spotify");
                  const data_spotify = await res.json();

                  let real_data = data_spotify.songs
                    .filter((song: any) =>
                      data.some((d: any) => d.song_id === song.id)
                    )
                    .map((song: any) => {
                      const songData = data.find((d: any) => d.song_id === song.id);
                      return {
                        ...song,
                        date_added: songData?.created_at,
                      };
                    });
                  const uniqueSongsMap = new Map();
                  real_data.forEach((song: any) => {
                    if (!uniqueSongsMap.has(song.id)) {
                      uniqueSongsMap.set(song.id, song);
                    }
                  });
                  real_data = Array.from(uniqueSongsMap.values());
                  setSongs(real_data);
                };

                fetchSongs();
              } else {
                setSongs([]);
              }
            } catch (err) {
              console.error("Error fetching playlist songs:", err);
              setSongs([]);
            }
          }
      setLoading(false);
    };
    fetchSongs();
  }, [playlistId]);

  const handleDelete = async (songId: string) => {
    if (!playlistId) return;

    try {
      const { error } = await supabase
        .from("song")
        .delete()
        .match({ playlist_id: playlistId, song_id: songId });

      if (error) throw error;

      setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
    } catch (err) {
      console.error("Error deleting song from playlist:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading songs...</div>;
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">No songs in this playlist yet.</p>
        <p className="mt-2 text-gray-400">Search for songs and add them to your playlist!</p>
      </div>
    );
  }

  const sortedSongs = [...songs].sort((a, b) => {
    if (!a.date_added || !b.date_added) return 0;
    const dateA = new Date(a.date_added).getTime();
    const dateB = new Date(b.date_added).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 w-16">#</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Album</th>
            <th
              className="py-3 px-4 text-right cursor-pointer select-none"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title="Sort by Date added"
            >
              Date added
              <svg
                className={`inline-block ml-1 w-4 h-4 transition-transform ${
                  sortOrder === "asc" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </th>
            <th className="py-3 px-4 w-16"></th>
          </tr>
        </thead>
        <tbody>
          {sortedSongs.map((song, index) => (
            <tr
              key={song.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-300 border-b border-gray-100 dark:border-gray-800"
            >
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 mr-4 flex-shrink-0">
                    <img
                      src={song.images && song.images[0]?.url}
                      alt={song.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{song.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {song.artists && song.artists.map((artist: any) => artist.name).join(", ")}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">{song.album?.name || song.name}</td>
              <td className="py-3 px-4 text-right">
                {song.date_added
                  ? new Date(song.date_added).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : ""}
              </td>
              <td className="py-3 px-4 text-right">
                <Button
                  color="red"
                  onClick={() => handleDelete(song.id)}
                  size="sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z" />
                  </svg>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaylistTable;
