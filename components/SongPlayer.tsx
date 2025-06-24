import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import getSpotifySession from "../app/lib/spotifySession";
import { Spinner } from "flowbite-react";

interface SongPlayerProps {
  setIsPlaying: (playing: boolean) => void;
  uri?: string;
  playTrigger: boolean;
  setPlayTrigger: (v: boolean) => void;
}

const SongPlayer: React.FC<SongPlayerProps> = ({ setIsPlaying, uri, playTrigger, setPlayTrigger }) => {
  const { accessToken, isLoading } = getSpotifySession();

  if (isLoading || !accessToken || !uri) {
    return <Spinner color="success" aria-label="Loading..." />;
  }

  return (
    <SpotifyPlayer
      token={accessToken}
      uris={[uri]}
      play={playTrigger}
      callback={(state) => {
        setIsPlaying(state.isPlaying);
        if (!state.isPlaying) {
          setPlayTrigger(false); // reset
        }
      }}
      styles={{ activeColor: "#1DB954" }}
    />
  );
};

export default SongPlayer;
