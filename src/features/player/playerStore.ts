// src/features/player/playerStore.ts
import { create } from 'zustand'           
import { persist } from 'zustand/middleware' 

import type { Track } from '@/types'

const LS_KEYS = {
  queue: 'gb_queue',
  index: 'gb_index',
  time: 'gb_time',
  playing: 'gb_isPlaying',
}

export type PlayerState = {
  queue: Track[]
  currentIndex: number
  isPlaying: boolean
  currentTime: number
  setQueue: (tracks: Track[], startIndex: number) => void
  playTrackByIndex: (index: number) => void
  playNext: () => void
  playPrev: () => void
  togglePlay: () => void
  setCurrentTime: (t: number) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: 0,
      isPlaying: false,
      currentTime: 0,
      setQueue: (tracks, startIndex) => {
        set({ queue: tracks, currentIndex: startIndex, isPlaying: true })
        localStorage.setItem(LS_KEYS.queue, JSON.stringify(tracks))
        localStorage.setItem(LS_KEYS.index, String(startIndex))
        localStorage.setItem(LS_KEYS.playing, 'true')
      },
      playTrackByIndex: (index) => {
        const { queue } = get()
        if (index < 0 || index >= queue.length) return
        set({ currentIndex: index, isPlaying: true })
        localStorage.setItem(LS_KEYS.index, String(index))
        localStorage.setItem(LS_KEYS.playing, 'true')
      },
      playNext: () => {
        const { currentIndex, queue } = get()
        const next = currentIndex + 1
        if (next < queue.length) {
          set({ currentIndex: next, isPlaying: true })
          localStorage.setItem(LS_KEYS.index, String(next))
          localStorage.setItem(LS_KEYS.playing, 'true')
        }
      },
      playPrev: () => {
        const { currentIndex } = get()
        const prev = currentIndex - 1
        if (prev >= 0) {
          set({ currentIndex: prev, isPlaying: true })
          localStorage.setItem(LS_KEYS.index, String(prev))
          localStorage.setItem(LS_KEYS.playing, 'true')
        }
      },
      togglePlay: () => set((s) => {
        const v = !s.isPlaying
        localStorage.setItem(LS_KEYS.playing, v ? 'true' : 'false')
        return { isPlaying: v }
      }),
      setCurrentTime: (t: number) => {
        set({ currentTime: t })
        localStorage.setItem(LS_KEYS.time, String(Math.floor(t)))
      },
    }),
    { name: 'gb_player_store',
      partialize: (s) => ({
        queue: s.queue,
        currentIndex: s.currentIndex,
        isPlaying: s.isPlaying,
        currentTime: s.currentTime,
      }),
    },
  ),
)
