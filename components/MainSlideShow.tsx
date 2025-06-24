import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Artist {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  genres: string[];
}

const MainSlideShow: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const dummyArtists: Artist[] = [
          {
            id: "1",
            name: "Taylor Swift",
            images: [{ url: "/taylor.png", width: 640, height: 640 }],
            genres: ["Pop"]
          },
          {
            id: "2",
            name: "The Weeknd",
            images: [{ url: "/weeknd.png", width: 640, height: 640 }],
            genres: ["R&B", "Pop"]
          },
          {
            id: "3",
            name: "Adele",
            images: [{ url: "/adele.png", width: 640, height: 640 }],
            genres: ["Soul", "Pop"]
          }
        ];

        await new Promise((res) => setTimeout(res, 500));
        setArtists(dummyArtists);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    if (artists.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsTransitioning(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [artists]);

  const handleTransitionEnd = () => {
    if (currentIndex === artists.length + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  };

  if (loading || artists.length === 0) {
    return (
      <div className="flex items-center justify-center text-white bg-black h-80 rounded-lg">
        Loading...
      </div>
    );
  }

  const extendedSlides = [
    artists[artists.length - 1],
    ...artists,
    artists[0]
  ];

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-lg">
      <div
        ref={sliderRef}
        className={`flex h-full transition-transform duration-700 ease-in-out ${
          !isTransitioning ? "transition-none" : ""
        }`}
        style={{
          width: `${extendedSlides.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / extendedSlides.length)}%)`
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((artist, index) => {
          const artistImage = artist.images?.[0]?.url;
          const mainGenre = artist.genres?.[0];

          return (
            <div
              key={index}
              className="relative h-80 w-full flex-shrink-0 text-white"
              style={{ width: `${100 / extendedSlides.length}%` }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={artistImage}
                  alt={`Foto ${artist.name}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-50 p-4 rounded-md">
                  <h1 className="text-xl md:text-2xl font-bold italic">{artist.name}</h1>
                  <p className="text-sm md:text-base">{mainGenre}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainSlideShow;
