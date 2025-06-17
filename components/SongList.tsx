import Link from "next/link";
import { Card } from "flowbite-react";
import { useEffect, useState, useRef } from "react";

interface SongListProps {
  onAddToPlaylist: (songId: string) => void;
  searchQuery?: string;
  onPlaySong: (song: any) => void;
}

const SongList = ({ onAddToPlaylist, searchQuery, onPlaySong }: SongListProps) => {
  const [songs, setSongs] = useState<any[]>([]);
  const [overflowingArtists, setOverflowingArtists] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch("/api/spotify");
      const data = await res.json();
      setSongs(data.songs);
      console.log(data.songs);
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      const newState: Record<string, boolean> = {};
      songs.forEach((song: any) => {
        const el = document.getElementById(`artist-${song.id}`);
        if (el && el.scrollWidth > el.clientWidth) {
          newState[song.id] = true;
        }
      });
      setOverflowingArtists(newState);
    };
    setTimeout(checkOverflow, 0);
  }, [songs]);

  const filteredSongs = searchQuery
    ? songs.filter((song) =>
        song.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : songs;

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
      {filteredSongs.map((song) => (
        <Link
          key={song.id}
          href={`/review/${song.id}`}
          className="max-w-sm w-full cursor-pointer no-underline"
        >
          <Card className="flex flex-col h-full p-2">
            <img
              src={song.images[0].url}
              alt={song.name}
              className="w-full h-auto mb-2 rounded-md"
            />
            <h2 className="text-lg font-bold tracking-tight text-[#2F4156] dark:text-white line-clamp-2">
              {song.name}
            </h2>
            <div className="flex-grow" />

            <div onClick={(e) => {
                e.preventDefault();
                onPlaySong(song);
              }} className="justify-items-end ">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" className="text-green-400">
                <path fill="currentColor" d="m10.65 15.75l4.875-3.125q.35-.225.35-.625t-.35-.625L10.65 8.25q-.375-.25-.763-.038t-.387.663v6.25q0 .45.388.663t.762-.038M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
              </svg>
            </div>
           
            
            <div className="flex items-center mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="group w-2/3 overflow-hidden">
                <p
                  id={`artist-${song.id}`}
                  className="font-normal text-[#567C8D] dark:text-gray-400 pr-2 relative overflow-hidden whitespace-nowrap"
                >
                  <span
                    className={
                      overflowingArtists[song.id]
                        ? "scrolling-text"
                        : "inline-block"
                    }
                  >
                    {song.artists.map((artist: any) => artist.name).join(", ")}
                  </span>
                </p>
              </div>

              <div className="w-1/3 flex justify-end">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToPlaylist(song.id);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#C8D9E6] hover:bg-[#567C8D] text-white cursor-pointer transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#2F4156"
                  >
                    <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default SongList;
