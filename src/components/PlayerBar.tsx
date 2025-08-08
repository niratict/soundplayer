// src/components/PlayerBar.tsx
import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../features/player/playerStore'
import { useAudio, setAudioEl } from '../features/player/useAudio'
import { formatTime } from '../utils/format'

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { current, play, pause, seekBy, seekTo, getDuration, getCurrentTime } = useAudio()
  const { isPlaying, togglePlay, playNext, playPrev } = usePlayerStore()

  useEffect(() => {
    if (audioRef.current) setAudioEl(audioRef.current)
  }, [])

  const cur = getCurrentTime()
  const dur = getDuration() || 0
  const pct = dur ? Math.min(100, Math.max(0, (cur / dur) * 100)) : 0

  const onToggle = () => { isPlaying ? pause() : play(); togglePlay() }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-t border-slate-700 shadow-2xl" data-testid="player-bar">
      <audio ref={audioRef} />
      
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
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button 
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-lg ${
                isPlaying 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400' 
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400'
              }`}
              onClick={onToggle} 
              data-testid={isPlaying ? "btn-pause" : "btn-play"}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
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
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
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
                  background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(236 72 153) ${pct}%, rgb(71 85 105) ${pct}%, rgb(71 85 105) 100%)`
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
                background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(236 72 153) ${pct}%, rgb(71 85 105) ${pct}%, rgb(71 85 105) 100%)`
              }}
            />
          </div>
          <span className="text-slate-400 text-xs tabular-nums">
            {formatTime(dur)}
          </span>
        </div>
      </div>
    </div>
  )
}