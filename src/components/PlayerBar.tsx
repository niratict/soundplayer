// src/components/PlayerBar.tsx
import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../features/player/playerStore";
import { useAudio, setAudioEl } from "../features/player/useAudio";
import { formatTime } from "../utils/format";

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    current,
    play,
    pause,
    seekBy,
    seekTo,
    getDuration,
    getCurrentTime,
    setVolume,
    getVolume,
  } = useAudio();
  const { isPlaying, togglePlay, playNext, playPrev } = usePlayerStore();

  const [volume, setVolumeState] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(100);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      setAudioEl(audioRef.current);
      // Initialize volume
      audioRef.current.volume = volume / 100;

      // Add Media Session API support for background playback on mobile
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", () => {
          play();
          usePlayerStore.getState().setIsPlaying(true);
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          pause();
          usePlayerStore.getState().setIsPlaying(false);
        });
        navigator.mediaSession.setActionHandler("previoustrack", playPrev);
        navigator.mediaSession.setActionHandler("nexttrack", playNext);
      }
    }
  }, []);

  // Update Media Session metadata when track changes
  useEffect(() => {
    if ("mediaSession" in navigator && current) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: current.trackName,
        artist: current.artistName,
        album: current.collectionName,
        artwork: [
          { src: current.artworkUrl100, sizes: "100x100", type: "image/jpeg" },
          {
            src: current.artworkUrl100.replace("100x100bb", "512x512bb"),
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });
    }
  }, [current]);

  const cur = getCurrentTime();
  const dur = getDuration() || 0;
  const pct = dur ? Math.min(100, Math.max(0, (cur / dur) * 100)) : 0;

  const onToggle = () => {
    isPlaying ? pause() : play();
    togglePlay();
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume);
    setVolume(newVolume / 100);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolumeState(prevVolume);
      setVolume(prevVolume / 100);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolumeState(0);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      );
    } else if (volume < 50) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      );
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-t border-slate-700 shadow-2xl"
      data-testid="player-bar"
    >
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      {/* Progress bar at top */}
      <div className="h-1 bg-slate-700">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Album art and track info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {current && (
              <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={current.artworkUrl100}
                  alt={current.trackName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {current ? (
                <>
                  <div className="text-white font-semibold text-sm truncate">
                    {current.trackName}
                  </div>
                  <div className="text-slate-400 text-xs truncate">
                    {current.artistName}
                  </div>
                </>
              ) : (
                <div className="text-slate-400 text-sm">ยังไม่ได้เลือกเพลง</div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              onClick={playPrev}
              data-testid="btn-prev"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-lg ${
                isPlaying
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400"
                  : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400"
              }`}
              onClick={onToggle}
              data-testid={isPlaying ? "btn-pause" : "btn-play"}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              onClick={playNext}
              data-testid="btn-next"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Volume Control - Desktop */}
          <div className="hidden lg:flex items-center gap-2 relative">
            <button
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              data-testid="btn-volume"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </button>

            {/* Volume Slider */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showVolumeSlider ? "w-24 opacity-100" : "w-0 opacity-0"
              }`}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <input
                data-testid="volume-slider"
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                type="range"
                min={0}
                max={100}
                step={1}
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${volume}%, rgb(71 85 105) ${volume}%, rgb(71 85 105) 100%)`,
                }}
              />
            </div>
          </div>

          {/* Volume Control - Mobile/Tablet */}
          <div className="lg:hidden">
            <button
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              onClick={toggleMute}
              data-testid="btn-volume-mobile"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </button>
          </div>

          {/* Time and seek bar */}
          <div className="hidden md:flex items-center gap-3 min-w-0 flex-1">
            <span className="text-slate-400 text-xs tabular-nums min-w-[40px]">
              {formatTime(cur)}
            </span>
            <div className="flex-1 group">
              <input
                data-testid="seek-slider"
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer slider"
                type="range"
                min={0}
                max={dur || 0}
                step={1}
                value={cur || 0}
                onChange={(e) => seekTo(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(236 72 153) ${pct}%, rgb(71 85 105) ${pct}%, rgb(71 85 105) 100%)`,
                }}
              />
            </div>
            <span className="text-slate-400 text-xs tabular-nums min-w-[40px] text-right">
              {formatTime(dur)}
            </span>
          </div>
        </div>

        {/* Mobile time bar */}
        <div className="md:hidden mt-2 flex items-center gap-3">
          <span className="text-slate-400 text-xs tabular-nums">
            {formatTime(cur)}
          </span>
          <div className="flex-1">
            <input
              data-testid="seek-slider-mobile"
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
              type="range"
              min={0}
              max={dur || 0}
              step={1}
              value={cur || 0}
              onChange={(e) => seekTo(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(236 72 153) ${pct}%, rgb(71 85 105) ${pct}%, rgb(71 85 105) 100%)`,
              }}
            />
          </div>
          <span className="text-slate-400 text-xs tabular-nums">
            {formatTime(dur)}
          </span>
        </div>

        {/* Mobile Volume Control */}
        <div className="lg:hidden mt-2 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="text-slate-400 text-xs">เสียง</div>
            <span className="text-slate-300 text-xs min-w-[30px] text-center">
              {volume}%
            </span>
          </div>
          <div className="flex-1">
            <input
              data-testid="volume-slider-mobile"
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${volume}%, rgb(71 85 105) ${volume}%, rgb(71 85 105) 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
