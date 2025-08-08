import { useEffect, useRef } from 'react'
import { usePlayerStore } from './playerStore'

let audioEl: HTMLAudioElement | null = null
export function setAudioEl(el: HTMLAudioElement | null) { audioEl = el }

export function useAudio() {
  const { queue, currentIndex, isPlaying, setCurrentTime, playNext } = usePlayerStore()
  const current = queue[currentIndex]
  const lastSrcRef = useRef<string | null>(null)

  useEffect(() => {
    if (!audioEl) return
    const onTime = () => setCurrentTime(audioEl!.currentTime)
    const onEnd = () => playNext()
    audioEl.addEventListener('timeupdate', onTime)
    audioEl.addEventListener('ended', onEnd)
    return () => {
      audioEl?.removeEventListener('timeupdate', onTime)
      audioEl?.removeEventListener('ended', onEnd)
    }
  }, [setCurrentTime, playNext])

  useEffect(() => {
    if (!audioEl || !current) return
    if (audioEl.src !== current.previewUrl) {
      audioEl.src = current.previewUrl
      lastSrcRef.current = current.previewUrl
    }
    if (isPlaying) {
      audioEl.play().catch(() => {/* ignore autoplay rejection */})
    } else {
      audioEl.pause()
    }
  }, [current?.previewUrl, isPlaying])

  return {
    audio: audioEl,
    current,
    play: () => audioEl?.play(),
    pause: () => audioEl?.pause(),
    seekBy: (delta: number) => { if (audioEl) audioEl.currentTime = Math.max(0, audioEl.currentTime + delta) },
    seekTo: (t: number) => { if (audioEl) audioEl.currentTime = Math.max(0, t) },
    getDuration: () => audioEl?.duration ?? 0,
    getCurrentTime: () => audioEl?.currentTime ?? 0,
  }
}