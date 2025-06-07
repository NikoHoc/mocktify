import React from "react";
// import SpotifyPlayer from 'react-spotify-web-playback';
// import useSpotifyToken from '../app/lib/spotifyToken';
// import { Spinner } from "flowbite-react";

const NowPlaying: React.FC = () => {
  const track = {
    title: "Sample Song",
    artist: "Sample Artist",
    albumArt: "/headphone.jpg",
  };

  // const token = useSpotifyToken();

  // if (!token) return <Spinner color="success" aria-label="Success spinner example" />;

  return (
    <div className="w-72 bg-white rounded-lg p-4 shadow-lg h-[calc(100vh-8rem)] border border-gray-300 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Now Playing</h2>
      <img
        src={track.albumArt}
        alt={track.title}
        className="w-48 h-48 rounded-lg object-cover mb-4"
      />
      <div className="text-center">
        {/* <SpotifyPlayer
          token={token}
          uris={['spotify:track:4uLU6hMCjMI75M1A2tKUQC']}
          autoPlay
        /> */}
        <div className="text-lg font-semibold text-gray-900">{track.title}</div>
        <div className="text-sm text-gray-600">{track.artist}</div>
        <div className="mt-2">
          <span className="text-green-500 font-semibold">Playing</span>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
