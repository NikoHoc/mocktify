import { Card } from "flowbite-react";
import { useEffect, useState } from "react";

const SongList = () => {
	const [songs, setSongs] = useState<any[]>([]);

	useEffect(() => {
		const fetchSongs = async () => {
			const res = await fetch("/api/spotify");

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
					<img
						src={song.images[0].url}
						alt={song.name}
						className="w-full h-auto mb-2"
					/>
					<h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{song.name}
					</h2>
					<p className="font-normal text-gray-700 dark:text-gray-400">
						{song.artists.map((artist: any) => artist.name).join(", ")}
					</p>
				</Card>
			))}
		</div>
	);
};

export default SongList;
