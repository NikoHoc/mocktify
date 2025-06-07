'use client'

import { useEffect, useState } from 'react';

const PlaylistTable = () => {
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
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 w-16">#</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Album</th>
                        <th className="py-3 px-4 text-right">
                            Date added
                            <svg className="inline-block ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </th>
                        <th className="py-3 px-4 w-16"></th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index) => (
                        <tr key={song.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
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
                                            {song.artists && song.artists.map((artist: any) => artist.name).join(', ')}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4">{song.album?.name || song.name}</td>
                            <td className="py-3 px-4 text-right">Aug 4, 2024</td>
                            <td className="py-3 px-4 text-right">
                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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