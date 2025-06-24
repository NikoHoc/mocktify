import { Card } from "flowbite-react";
import { useEffect, useState } from 'react';
import { signInWithSpotify } from "../app/lib/auth";

const SongList = () => {
    const [songs, setSongs] = useState<any[]>([]);

    useEffect(() => {
        const fetchSongs = async () => {
            const res = await fetch('/api/spotify');

            const data = await res.json();
            setSongs(data.songs);
            console.log(data.songs);
        };

        fetchSongs();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-10 justify-items-center">
            {songs.map((song) => (
                <Card key={song.id} className="max-w-sm">
                    <img src={song.images[0].url} alt={song.name} className="w-full h-auto mb-2" />
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{song.name}</h2>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-auto pt-2 flex justify-between">
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            {song.artists.map((artist: any) => artist.name).join(', ')}
                        </p>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#C8D9E6] hover:bg-[#567C8D] text-white cursor-pointer transition"
                        onClick={signInWithSpotify} >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#2F4156">
                                <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
                            </svg>
                        </div>
                    </div>
                    
                </Card>
            ))}
        </div>
    )
}

export default SongList;