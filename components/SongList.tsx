import Link from "next/link";
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
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
      {filteredSongs.map(
        (song) => (
          console.log(song.id),
          (
            <Link key={song.id} href={`/review/${song.id}`} passHref legacyBehavior>
              <a className="max-w-sm w-full cursor-pointer no-underline">
                <Card className="flex flex-col h-full">
                  <img src={song.images[0].url} alt={song.name} className="w-full h-auto mb-2" />
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {song.name}
                  </h2>
                  <p className="font-normal text-gray-700 dark:text-gray-400 flex-grow">
                    {song.artists.map((artist: any) => artist.name).join(", ")}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToPlaylist(song.id);
                    }}
                    color="blue"
                  >
                    Add to Playlist
                  </Button>
                </Card>
              </a>
            </Link>
          )
        )
      )}
    </div>
  );
};

export default SongList;
