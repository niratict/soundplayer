import { Play, Music } from "lucide-react";
import { Track } from "../types";
import { usePlayerStore } from "../features/player/playerStore";
import { truncateText } from "../utils/format";

interface TrackListProps {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
}

const TrackList = ({ tracks, isLoading, error }: TrackListProps) => {
  const { setQueue, playAt, queue, currentIndex, isPlaying } = usePlayerStore();

  const handleTrackClick = (track: Track, index: number) => {
    // Find the clicked track's position in the current list
    const trackIndex = tracks.findIndex((t) => t.trackId === track.trackId);
    if (trackIndex === -1) return;

    // Set queue starting from the clicked track
    const newQueue = tracks.slice(trackIndex);
    setQueue(newQueue, 0);
    playAt(0);
  };

  const isCurrentTrack = (track: Track) => {
    return queue[currentIndex]?.trackId === track.trackId;
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 backdrop-blur-sm">
          <span className="text-red-500">⚠️</span> {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-700/50 rounded-xl p-4 h-20 backdrop-blur-sm border border-slate-600/30"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-slate-800/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-700/50">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Music className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-400 text-lg">
            Search for your favorite songs above
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Discover millions of tracks from iTunes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="track-list" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6"></div>

      {/* Track List with Custom Scrollbar */}
      <div
        className="max-h-[500px] overflow-y-auto pr-1"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#6366f1 transparent",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 8px;
          }

          div::-webkit-scrollbar-track {
            background: rgba(30, 41, 59, 0.3);
            border-radius: 4px;
            margin: 4px 0;
          }

          div::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            border-radius: 4px;
            border: 1px solid rgba(30, 41, 59, 0.5);
            transition: all 0.3s ease;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #7c3aed, #db2777);
            box-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
          }

          div::-webkit-scrollbar-thumb:active {
            background: linear-gradient(135deg, #6d28d9, #be185d);
          }

          div::-webkit-scrollbar-corner {
            background: transparent;
          }
        `}</style>

        <div className="space-y-2">
          {tracks.map((track, index) => {
            const isCurrent = isCurrentTrack(track);

            return (
              <div
                key={track.trackId}
                data-testid={`track-row-${track.trackId}`}
                onClick={() => handleTrackClick(track, index)}
                className={`group cursor-pointer p-4 rounded-xl border transition-all duration-300 
                           hover:scale-[1.01] hover:shadow-xl backdrop-blur-sm
                           ${
                             isCurrent
                               ? "bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20"
                               : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 hover:border-slate-600"
                           }`}
                role="button"
                tabIndex={0}
                aria-label={`Play ${track.trackName} by ${track.artistName}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTrackClick(track, index);
                  }
                }}
              >
                <div className="flex items-center space-x-4">
                  {/* Track Number */}
                  <div className="w-6 text-center flex-shrink-0">
                    <span className="text-sm text-slate-500 group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play className="w-4 h-4 text-slate-400 hidden group-hover:block mx-auto" />
                  </div>

                  {/* Artwork */}
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <img
                      src={track.artworkUrl100}
                      alt={`${track.trackName} artwork`}
                      className="w-full h-full rounded-lg border border-slate-600 object-cover shadow-lg"
                      loading="lazy"
                    />

                    {/* Play overlay */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-lg
                                    ${
                                      isCurrent && isPlaying
                                        ? "bg-gradient-to-br from-purple-500/90 to-pink-500/90"
                                        : "bg-black/0 group-hover:bg-black/60"
                                    } transition-all duration-300`}
                    >
                      <Play
                        className={`w-6 h-6 text-white drop-shadow-lg
                                      ${
                                        isCurrent && isPlaying
                                          ? "opacity-100 scale-110"
                                          : "opacity-0 group-hover:opacity-100 group-hover:scale-110"
                                      } transition-all duration-300`}
                      />
                    </div>

                    {/* Playing indicator */}
                    {isCurrent && isPlaying && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-base font-medium truncate transition-colors duration-200
                                   ${
                                     isCurrent
                                       ? "text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"
                                       : "text-white group-hover:text-slate-200"
                                   }`}
                    >
                      {truncateText(track.trackName, 45)}
                    </h3>
                    <p
                      className={`text-sm truncate mt-1 transition-colors duration-200
                                 ${
                                   isCurrent
                                     ? "text-purple-300"
                                     : "text-slate-400 group-hover:text-slate-300"
                                 }`}
                    >
                      {truncateText(track.artistName, 40)}
                    </p>
                    {track.collectionName && (
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {truncateText(track.collectionName, 40)}
                      </p>
                    )}
                  </div>

                  {/* Duration & Actions */}
                  <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                    {/* Duration */}
                    <span className="text-xs text-slate-500">
                      {track.trackTimeMillis
                        ? `${Math.floor(
                            track.trackTimeMillis / 60000
                          )}:${String(
                            Math.floor((track.trackTimeMillis % 60000) / 1000)
                          ).padStart(2, "0")}`
                        : "--:--"}
                    </span>

                    {/* Play indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                    ${
                                      isCurrent && isPlaying
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                                        : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-slate-300"
                                    }`}
                    >
                      <Play
                        className={`w-4 h-4 ${
                          isCurrent && isPlaying ? "animate-pulse" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-6 pt-4 border-t border-slate-700/50"></div>
    </div>
  );
};

export default TrackList;
