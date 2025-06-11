import React from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import getSpotifySession from '../app/lib/spotifySession';
import { Spinner } from "flowbite-react";

const NowPlaying: React.FC = () => {
  const { accessToken, isLoading } = getSpotifySession();

  if (isLoading || !accessToken) {
    return <Spinner color="success" aria-label="Loading..." />;
  }

  return (
        <SpotifyPlayer
          token={accessToken}
          uris={['spotify:album:7oms6zH06xEyReTsPsuzWi']}
          play={false}
        />
    );
};

export default NowPlaying;
