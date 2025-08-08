import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import TrackList from './components/TrackList'
import NowPlayingCard from './components/NowPlayingCard'
import PlayerBar from './components/PlayerBar'
import type { Track } from './types'
import { usePlayerStore } from './features/player/playerStore'
import { useAudio } from './features/player/useAudio'

export default function App() {
  const [results, setResults] = useState<Track[]>([])
  const { togglePlay } = usePlayerStore()
  const { seekBy } = useAudio()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      if (e.code === 'Space') { e.preventDefault(); togglePlay() }
      if (e.code === 'ArrowLeft') { e.preventDefault(); seekBy(-5) }
      if (e.code === 'ArrowRight') { e.preventDefault(); seekBy(5) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, seekBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                    SoundWave
                  </h1>
                  <p className="text-slate-400 text-sm hidden md:block">Your premium music experience</p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full text-xs text-slate-300">
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Space</kbd>
                  <span>Play/Pause</span>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full text-xs text-slate-300">
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">←/→</kbd>
                  <span>Seek ±5s</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Search & Library */}
            <div className="xl:col-span-2 space-y-8">
              {/* Search Section */}
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Discover Music</h2>
                  <p className="text-slate-400">Search for your favorite tracks and artists</p>
                </div>
                <SearchBar onPickResults={setResults} />
              </section>

              {/* Track List Section */}
              <section>
                {results.length > 0 && (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">Search Results</h2>
                      <p className="text-slate-400">Found {results.length} tracks</p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
                      <TrackList tracks={results} />
                    </div>
                  </>
                )}
              </section>
            </div>

            {/* Right Column - Now Playing */}
            <div className="xl:col-span-1">
              <div className="sticky top-32">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Now Playing</h2>
                  <p className="text-slate-400">Current track information</p>
                </div>
                <NowPlayingCard />
              </div>
            </div>
          </div>

          {/* Featured Sections */}
          <div className="mt-16 space-y-12">
            {/* Recently Played */}
            <section className="opacity-60 hover:opacity-100 transition-opacity duration-300">
              <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl mb-3 shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                      Playlist {i}
                    </p>
                    <p className="text-xs text-slate-500">Various Artists</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Made For You */}
            <section className="opacity-60 hover:opacity-100 transition-opacity duration-300">
              <h2 className="text-2xl font-bold mb-6">Made for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Discover Weekly', 'Daily Mix 1', 'Release Radar'].map((title, i) => (
                  <div key={title} className="group cursor-pointer">
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 border border-slate-600/30">
                      <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-4 flex items-center justify-center">
                        <svg className="w-12 h-12 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                        {title}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Your personalized playlist updated weekly
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Spacer for fixed player */}
        <div className="h-32"></div>
      </div>

      {/* Fixed Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <PlayerBar />
      </div>
    </div>
  )
}