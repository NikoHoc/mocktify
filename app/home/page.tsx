import React, { useState, useEffect } from "react";
import SongList from "@/components/SongList";
import AddPlaylistModal from "@/components/AddPlaylistModal";
import { supabase } from "../lib/supabaseClient";

interface Playlist {
  id: string;
  name: string;
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
				.select("id, name, created_at")
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

	const handleCreatePlaylist = (playlist: { name: string; user_id: string }) => {
		// For now, just log the playlist data. Replace with actual creation logic.
		console.log("Creating playlist:", playlist);
	};

	return (
		<>
			<div
				className="w-full h-120 bg-cover bg-center text-white flex flex-col items-center justify-center text-center px-4"
				style={{ backgroundImage: "url('/headphone.jpg')" }}
			>
				<h1 className="text-4xl font-bold italic text-[#ECF0F1]">MOCKTIFY</h1>
				<p className="text-lg italic font-normal text-[#ECF0F1]">
					Keep up with your favorite songs through Mocktify
				</p>
			</div>
			<div className="flex mt-6 px-10">
				{/* Sidebar */}
				{isUserLoggedIn && (
					<div className="w-64 mr-6 bg-gray-100 rounded p-4 shadow-md h-[calc(100vh-8rem)] overflow-y-auto">
						<h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
						{playlists.length === 0 ? (
							<p className="text-gray-600">No playlists found.</p>
						) : (
							<ul>
								{playlists.map((playlist) => (
									<li
										key={playlist.id}
										className="mb-2 cursor-pointer hover:text-blue-600"
									>
										{playlist.name}
									</li>
								))}
							</ul>
						)}
					</div>
				)}
				{/* Main content */}
				<div className="flex-1">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold ">New Release Song</h1>
						{isUserLoggedIn && (
							<button
								onClick={() => setIsModalOpen(true)}
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								Add Playlist
							</button>
						)}
					</div>
					<div className="mt-4 mb-5">
						<SongList />
					</div>
				</div>
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
