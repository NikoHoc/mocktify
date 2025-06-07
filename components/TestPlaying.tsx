import React from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import useSpotifyToken from '../app/lib/spotifyToken';
import { Spinner } from "flowbite-react";

const NowPlaying: React.FC = () => {
  const token = useSpotifyToken();

  if (!token) return <Spinner color="success" aria-label="Success spinner example" />;

  return (
        <SpotifyPlayer
          token={token}
          uris={['spotify:track:4uLU6hMCjMI75M1A2tKUQC']}
          autoPlay
        />
    );
};

export default NowPlaying;
