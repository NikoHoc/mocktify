import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Artist {
  id: string;
  name: string;
  images: { url: string; width: number; height: number }[];
  genres: string[];
}

const artists: Artist[] = [
  {
    id: "1",
    name: "Taylor Swift",
    images: [{ url: "/taylor.png", width: 640, height: 640 }],
    genres: ["Pop"],
  },
  {
    id: "2",
    name: "The Weeknd",
    images: [{ url: "/weeknd.png", width: 640, height: 640 }],
    genres: ["R&B", "Pop"],
  },
  {
    id: "3",
    name: "Adele",
    images: [{ url: "/adele.png", width: 640, height: 640 }],
    genres: ["Soul", "Pop"],
  },
];

const MainSlideShow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === artists.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentArtist = artists[currentIndex];

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-lg">
      <div className="relative w-full h-full">
        <Image
          src={currentArtist.images[0].url}
          alt={currentArtist.name}
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/60 to-transparent text-white p-4 z-10">
          <h2 className="text-xl font-bold drop-shadow-md">{currentArtist.name}</h2>
          <p className="text-sm drop-shadow-sm">{currentArtist.genres.join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

export default MainSlideShow;
