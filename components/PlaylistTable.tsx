"use client";

import { useEffect, useState } from "react";

const PlaylistTable = () => {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch("/api/spotify");
      const data = await res.json();
      setSongs(data.songs);
    };

    fetchSongs();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 w-16">#</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Album</th>
            <th className="py-3 px-4 text-right">
              Date added
              <svg
                className="inline-block ml-1 w-4 h-4"
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
          {songs.map((song, index) => (
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
              <td className="py-3 px-4 text-right">Aug 4, 2024</td>
              <td className="py-3 px-4 text-right">
                <button className="text-gray-600 hover:text-red-500 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor" 
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaylistTable;
