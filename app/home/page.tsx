"use client";

import React, { useState, useEffect } from "react";
import SongList from "@/components/SongList";
import AddPlaylistModal from "@/components/AddPlaylistModal";
import NowPlaying from "@/components/NowPlaying";
import { supabase } from "../lib/supabaseClient";

interface Playlist {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  created_at: string;
}

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);
	const [playlists, setPlaylists] = useState<Playlist[]>([]);

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

	const handleCreatePlaylist = async (playlist: { name: string; description?: string; imageFile?: File; user_id: string }) => {
		try {
			const formData = new FormData();
			formData.append('name', playlist.name);
			if (playlist.description) {
				formData.append('description', playlist.description);
			}
			formData.append('user_id', playlist.user_id);
			if (playlist.imageFile) {
				formData.append('image', playlist.imageFile);
			}

			const response = await fetch('/api/playlists', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				let errorMessage = 'Unknown error';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || JSON.stringify(errorData);
				} catch {
					// ignore JSON parse errors
				}
				console.error('Error creating playlist:', errorMessage);
				return;
			}

			const data = await response.json();
			if (data.playlist) {
				setPlaylists((prev) => [data.playlist, ...prev]);
			}
		} catch (error) {
			console.error('Error creating playlist:', error);
		}
	};

	return (
		<>
			<div
				className="w-full h-12 bg-cover bg-center text-white flex flex-col items-center justify-center text-center px-4 mx-auto max-w-4xl"
				style={{ backgroundImage: "url('/headphone.jpg')" }}
			>
				<h1 className="text-base font-bold italic text-[#ECF0F1]">MOCKTIFY</h1>
				<p className="text-xs italic font-normal text-[#ECF0F1]">
					Keep up with your favorite songs through Mocktify
				</p>
			</div>
			<div className="flex mt-6 h-[calc(100vh-4rem)]">
				{/* Playlist Sidebar */}
				{isUserLoggedIn && (
					<div className="w-1/6 bg-white rounded-lg p-4 shadow-lg h-full border border-gray-300">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-2xl font-bold text-gray-800">Your Playlists</h2>
							<button
								onClick={() => setIsModalOpen(true)}
								className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								Add
							</button>
						</div>
						{playlists.length === 0 ? (
							<p className="text-gray-600">No playlists found.</p>
						) : (
							<ul className="space-y-3">
								{playlists.map((playlist) => (
									<li
										key={playlist.id}
										className="cursor-pointer hover:bg-blue-100 rounded p-2 flex items-center space-x-4 transition"
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
									</li>
								))}
							</ul>
						)}
					</div>
				)}
				{/* Main content */}
				<div className="flex-1 mx-4 overflow-y-auto h-full">
					<div className="flex items-center justify-center">
						<h1 className="text-2xl font-bold">New Release Song</h1>
					</div>
					<div className="mt-4 mb-5">
						<SongList />
					</div>
				</div>
				{/* Now Playing Sidebar */}
				{isUserLoggedIn && (
					<div className="w-1/5 h-full">
						<NowPlaying />
					</div>
				)}
			</div>
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
		</>
	);
}
