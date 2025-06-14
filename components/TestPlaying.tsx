import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import getSpotifySession from "../app/lib/spotifySession";
import { Spinner } from "flowbite-react";

interface TestPlayingProps {
  setIsPlaying: (playing: boolean) => void;
}

const TestPlaying: React.FC<TestPlayingProps> = ({ setIsPlaying }) => {
  const { accessToken, isLoading } = getSpotifySession();

  if (isLoading || !accessToken) {
    return <Spinner color="success" aria-label="Loading..." />;
  }

  return (
    <SpotifyPlayer
      token={accessToken}
      uris={["spotify:album:7oms6zH06xEyReTsPsuzWi"]}
      callback={(state) => {
        setIsPlaying(state.isPlaying); // kirim status ke parent
      }}
      play={false}
      styles={{
        activeColor: "#1DB954",
      }}
    />
  );
};

export default TestPlaying;
