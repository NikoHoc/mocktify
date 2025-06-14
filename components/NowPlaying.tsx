import React from "react";

interface NowPlayingProps {
  isPlaying: boolean;
}

const NowPlaying: React.FC<NowPlayingProps> = ({ isPlaying }) => {
  const song = {
    title: "Sample Song",
    artist: "Sample Artist",
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      },
    ],
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-lg p-4 shadow-lg border bg-[#C8D9E6]/40 border-[#F5EFEB] backdrop-blur-md shadow-md flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Now Playing</h2>
      <div className="relative aspect-square w-32 sm:w-40 md:w-52 lg:w-60 xl:w-72 mb-4">
        <div
          className={`w-full h-full rounded-full relative ${
            isPlaying ? "animate-spin-slow" : ""
          }`}
        >
          <img
            src="/vinyl.png"
            alt="Vinyl"
            className="w-full h-full rounded-full object-cover"
          />
          <img
            src={song.images[0].url}
            alt="Album Art"
            className="absolute top-1/2 left-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full object-cover transform -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-md"
          />
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-900">{song.title}</div>
        <div className="text-sm text-gray-600">{song.artist}</div>
        <div className="mt-2">
          <span className="text-green-500 font-semibold">
            {isPlaying ? "Playing" : "Paused"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
