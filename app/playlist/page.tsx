'use client'

import { useState, useEffect } from 'react';
import PlaylistTable from '@/components/PlaylistTable';

export default function Playlist() {
    const [playlistImage, setPlaylistImage] = useState<string | null>(null);
    const [playlistName, setPlaylistName] = useState('My Playlist');
    const [playlistDescription, setPlaylistDescription] = useState('Your personal collection of tracks');
    const [isEditing, setIsEditing] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('from-purple-800 to-gray-900');

    // Handle image upload and extract dominant color
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const dataUrl = e.target.result as string;
                    setPlaylistImage(dataUrl);
                    
                    // Extract dominant color from image
                    const img = new Image();
                    img.src = dataUrl;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto px-4 pt-24 pb-8"> {/* Added pt-24 for navbar spacing */}
            {/* Jumbotron/Header */}
            <div className={`bg-gradient-to-b ${backgroundColor} p-8 rounded-lg mb-8 text-white`}>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Playlist Image */}
                    <div className="relative w-48 h-48 flex-shrink-0 bg-gray-700 rounded-md shadow-lg">
                        {playlistImage ? (
                            <img 
                                src={playlistImage} 
                                alt="Playlist Cover" 
                                className="w-full h-full object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
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
                        <p className="text-sm uppercase font-semibold">PLAYLIST</p>
                        
                        {isEditing ? (
                            <div className="space-y-3 mt-2">
                                <input
                                    type="text"
                                    value={playlistName}
                                    onChange={(e) => setPlaylistName(e.target.value)}
                                    className="text-3xl font-bold bg-transparent border-b border-white w-full focus:outline-none"
                                />
                                <textarea
                                    value={playlistDescription}
                                    onChange={(e) => setPlaylistDescription(e.target.value)}
                                    className="text-gray-300 bg-transparent border border-gray-600 rounded p-2 w-full focus:outline-none"
                                    rows={2}
                                ></textarea>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-5xl font-bold mt-2 mb-4">{playlistName}</h1>
                                <p className="text-gray-300 mb-4">{playlistDescription}</p>
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
            
            <PlaylistTable />
        </div>
    );
}