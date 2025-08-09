import React, { useState, useEffect } from "react";
import { Music } from "lucide-react";
import { usePlayerStore } from "../features/player/playerStore";
import { truncateText } from "../utils/format";

// Soundwave Component
const Soundwave = ({ isPlaying }) => {
  const bars = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center space-x-1 h-12 absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-lg">
      {bars.map((bar) => (
        <div
          key={bar}
          className={`bg-gradient-to-t from-pink-500 to-pink-300 rounded-full transition-all duration-75 ${
            isPlaying ? "animate-pulse" : "opacity-30"
          }`}
          style={{
            width: "2px",
            height: isPlaying ? `${Math.random() * 30 + 5}px` : "3px",
            animationDelay: `${bar * 0.1}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
};

const NowPlayingCard = () => {
  const { queue, currentIndex, isPlaying, isLoading } = usePlayerStore();
  const currentTrack = queue[currentIndex];
  const [waveAnimation, setWaveAnimation] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setWaveAnimation((prev) => !prev);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  if (!currentTrack) {
    return (
      <div
        id="now-playing"
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center">
          <div className="relative">
            <Music className="w-20 h-20 text-slate-400/30 mx-auto mb-4" />
            <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl" />
          </div>
          <p className="font-pixel text-slate-400 text-sm">No track selected</p>
          <p className="font-pixel text-slate-400/60 text-xs mt-2">
            Search and play music to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="now-playing"
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-pink-600/10 blur-3xl" />

      <div className="text-center relative z-10">
        {/* Artwork */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg blur-lg" />
          <img
            src={currentTrack.artworkUrl100}
            alt={`${currentTrack.trackName} artwork`}
            className="relative w-full h-full rounded-lg border border-slate-600 object-cover shadow-lg ring-1 ring-purple-500/20"
          />

          {/* Soundwave overlay when playing */}
          {isPlaying && !isLoading && <Soundwave isPlaying={isPlaying} />}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Playing pulse ring */}
          {isPlaying && !isLoading && (
            <div className="absolute inset-0 rounded-lg border border-purple-400/30 animate-pulse" />
          )}
        </div>

        {/* Track info */}
        <div className="space-y-2">
          <h2 className="font-pixel text-lg font-bold text-white leading-tight">
            {truncateText(currentTrack.trackName, 25)}
          </h2>

          <p className="font-pixel text-sm text-slate-400">
            {truncateText(currentTrack.artistName, 30)}
          </p>
        </div>

        {/* Status */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-center space-x-3 pb-5">
            <div
              className={`w-2 h-2 rounded-full ${
                isLoading
                  ? "bg-yellow-500 animate-pulse"
                  : isPlaying
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                  : "bg-slate-400/30"
              }`}
            />
            <div className="font-pixel text-sm text-slate-300 translate-y-[-1px]  ">
              {isLoading
                ? "กำลังโหลด..."
                : isPlaying
                ? "กำลังเล่น"
                : "หยุดชั่วคราว"}
            </div>
          </div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/60 to-transparent rounded-b-xl pointer-events-none" />
      </div>
    </div>
  );
};

export default NowPlayingCard;
