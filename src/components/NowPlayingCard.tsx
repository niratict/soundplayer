import { usePlayerStore } from '../features/player/playerStore'

export default function NowPlayingCard() {
  const { queue, currentIndex, isPlaying } = usePlayerStore()
  const current = queue[currentIndex]

  if (!current) return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700" data-testid="now-playing">
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l6-6v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
        </div>
        <h3 className="text-slate-400 text-lg font-medium mb-2">ยังไม่ได้เลือกเพลง</h3>
        <p className="text-slate-500 text-sm">ค้นหาและเลือกเพลงที่คุณชื่นชอบ</p>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 overflow-hidden relative" data-testid="now-playing">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 opacity-50"></div>
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            ) : (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              {isPlaying ? 'กำลังเล่น' : 'หยุดชั่วคราว'}
            </h3>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* Large Album Art */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={current.artworkUrl100} 
                alt={current.trackName} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            
            {/* Vinyl effect overlay */}
            <div className="absolute inset-0 rounded-2xl">
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-2xl ${
                isPlaying ? 'animate-pulse' : ''
              }`}></div>
              {/* Shine effect */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Track Details */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-xl leading-tight mb-2 line-clamp-2">
              {current.trackName}
            </h2>
            <h3 className="text-slate-300 font-medium text-lg mb-4 line-clamp-1">
              {current.artistName}
            </h3>
            
            {/* Queue info */}
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>
                เพลงที่ {currentIndex + 1} จาก {queue.length}
              </span>
            </div>

            {/* Audio visualizer bars (decorative) */}
            {isPlaying && (
              <div className="flex items-end gap-1 mt-4 h-8">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-purple-500 to-pink-400 rounded-full animate-pulse"
                    style={{
                      width: '3px',
                      height: `${Math.random() * 24 + 8}px`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${0.5 + Math.random()}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}