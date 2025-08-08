import type { Track } from '../types'
import { usePlayerStore } from '../features/player/playerStore'

type Props = { tracks: Track[] }

export default function TrackList({ tracks }: Props) {
  const setQueue = usePlayerStore((s) => s.setQueue)
  const { current } = usePlayerStore()

  const onClickRow = (idx: number) => {
    setQueue(tracks, idx)
  }

  if (tracks.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l6-6v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">ผลการค้นหา</h3>
          <p className="text-slate-400 text-sm">{tracks.length} เพลง</p>
        </div>
      </div>

      <div className="space-y-3">
        {tracks.map((t, i) => {
          const isCurrentlyPlaying = current?.trackId === t.trackId
          
          return (
            <button
              key={t.trackId}
              data-testid={`track-row-${t.trackId}`}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${
                isCurrentlyPlaying 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30' 
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
              } hover:scale-[1.01] hover:shadow-lg`}
              onClick={() => onClickRow(i)}
              title="เล่นเพลงนี้และตั้งคิว"
            >
              {/* Album Art */}
              <div className="relative">
                <img 
                  src={t.artworkUrl100} 
                  alt={t.trackName} 
                  className="w-16 h-16 object-cover rounded-lg shadow-md" 
                />
                <div className={`absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isCurrentlyPlaying ? 'opacity-100' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrentlyPlaying 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-white/20 backdrop-blur-sm'
                  }`}>
                    {isCurrentlyPlaying ? (
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
                        <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    ) : (
                      <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className={`font-semibold leading-tight truncate ${
                  isCurrentlyPlaying ? 'text-purple-300' : 'text-white group-hover:text-purple-300'
                } transition-colors duration-300`}>
                  {t.trackName}
                </div>
                <div className="text-slate-400 text-sm truncate mt-1 group-hover:text-slate-300 transition-colors duration-300">
                  {t.artistName}
                </div>
              </div>

              {/* Track Number */}
              <div className={`text-xs font-mono px-2 py-1 rounded ${
                isCurrentlyPlaying 
                  ? 'bg-purple-400/20 text-purple-300' 
                  : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
              } transition-colors duration-300`}>
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Play indicator */}
              <div className={`transition-all duration-300 ${
                isCurrentlyPlaying ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {isCurrentlyPlaying ? (
                  <div className="text-purple-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z"/>
                    </svg>
                  </div>
                ) : (
                  <div className="text-slate-400 group-hover:text-purple-400 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 015 0v1.5M9 14h6" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}