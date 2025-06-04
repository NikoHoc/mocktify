'use client'

import Image from "next/image";
import { Card } from "flowbite-react";
import { useEffect, useState } from 'react';

export default function Home() {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch('/api/spotify');
      const data = await res.json();
      setSongs(data.songs);
    };

    fetchSongs();
  }, []);


  return (
    <div className="justify-items-center">
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Card href="#" className="max-w-sm">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Noteworthy technology acquisitions 2021
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
        </p>
      </Card>
      <h1 className="text-3xl font-bold mb-6">🎵 Trending Spotify Releases</h1>
      <div className="grid grid-cols-2 gap-4">
        {songs.map((song) => (
          <div key={song.id} className="border p-4 rounded-lg shadow">
            <img src={song.images[0].url} alt={song.name} className="w-full h-auto mb-2" />
            <h2 className="font-semibold">{song.name}</h2>
            <p className="text-sm text-gray-500">
              {song.artists.map((artist: any) => artist.name).join(', ')}
            </p>
          </div>
        ))}
      </div>
      
    </div>
  );
}
