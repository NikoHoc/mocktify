import { Card, Button } from "flowbite-react";
import { useEffect, useState } from "react";

interface SongListProps {
  onAddToPlaylist: (songId: string) => void;
  searchQuery?: string;
}

const SongList = ({ onAddToPlaylist, searchQuery }: SongListProps) => {
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

  const filteredSongs = searchQuery
    ? songs.filter((song) =>
        song.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : songs;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-10 justify-items-center">
      {filteredSongs.map(
        (song) => (
          console.log(song.id),
          (
            <Card key={song.id} className="max-w-sm">
              <img src={song.images[0].url} alt={song.name} className="w-full h-auto mb-2" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {song.name}
              </h2>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {song.artists.map((artist: any) => artist.name).join(", ")}
              </p>
              <Button className="mt-4" onClick={() => onAddToPlaylist(song.id)} color="blue">
                Add to Playlist
              </Button>
            </Card>
          )
        )
      )}
    </div>
  );
};

export default SongList;
