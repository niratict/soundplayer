import { useEffect, useRef } from "react";
import { usePlayerStore } from "./playerStore";

let audioEl: HTMLAudioElement | null = null;
export function setAudioEl(el: HTMLAudioElement | null) {
  audioEl = el;
}

export function useAudio() {
  const { queue, currentIndex, isPlaying, setCurrentTime, playNext } =
    usePlayerStore();
  const current = queue[currentIndex];
  const lastSrcRef = useRef<string | null>(null);

  useEffect(() => {
    if (!audioEl) return;

    const onTime = () => setCurrentTime(audioEl!.currentTime);
    const onEnd = () => playNext();
    const onLoadedMetadata = () => {
      // Ensure volume is set when metadata loads
      if (audioEl) {
        audioEl.volume = audioEl.volume || 1;
      }
    };

    // Add error handling for better mobile compatibility
    const onError = (e: any) => {
      console.warn("Audio error:", e);
    };

    const onCanPlay = () => {
      // Try to play if supposed to be playing
      if (isPlaying && audioEl) {
        audioEl.play().catch(console.warn);
      }
    };

    audioEl.addEventListener("timeupdate", onTime);
    audioEl.addEventListener("ended", onEnd);
    audioEl.addEventListener("loadedmetadata", onLoadedMetadata);
    audioEl.addEventListener("error", onError);
    audioEl.addEventListener("canplay", onCanPlay);

    return () => {
      audioEl?.removeEventListener("timeupdate", onTime);
      audioEl?.removeEventListener("ended", onEnd);
      audioEl?.removeEventListener("loadedmetadata", onLoadedMetadata);
      audioEl?.removeEventListener("error", onError);
      audioEl?.removeEventListener("canplay", onCanPlay);
    };
  }, [setCurrentTime, playNext, isPlaying]);

  useEffect(() => {
    if (!audioEl || !current) return;

    // Only change src if it's different to avoid interruption
    if (audioEl.src !== current.previewUrl) {
      audioEl.src = current.previewUrl;
      lastSrcRef.current = current.previewUrl;

      // Preload the audio for smoother playback
      audioEl.load();
    }

    // Handle play/pause state
    if (isPlaying) {
      // Add a small delay to ensure audio is ready
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay prevented:", error);
          // Could show a user notification here
        });
      }
    } else {
      audioEl.pause();
    }
  }, [current?.previewUrl, isPlaying]);

  // Wake lock for keeping screen on during playback (optional)
  useEffect(() => {
    let wakeLock: any = null;

    const requestWakeLock = async () => {
      if ("wakeLock" in navigator && isPlaying) {
        try {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        } catch (err) {
          console.warn("Wake lock request failed:", err);
        }
      }
    };

    const releaseWakeLock = () => {
      if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
      }
    };

    if (isPlaying) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return releaseWakeLock;
  }, [isPlaying]);

  return {
    audio: audioEl,
    current,
    play: () => {
      if (audioEl) {
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          return playPromise.catch((error) => {
            console.warn("Play failed:", error);
            throw error;
          });
        }
      }
      return Promise.resolve();
    },
    pause: () => {
      if (audioEl) {
        audioEl.pause();
      }
    },
    seekBy: (delta: number) => {
      if (audioEl) {
        audioEl.currentTime = Math.max(
          0,
          Math.min(audioEl.duration || 0, audioEl.currentTime + delta)
        );
      }
    },
    seekTo: (t: number) => {
      if (audioEl) {
        audioEl.currentTime = Math.max(0, Math.min(audioEl.duration || 0, t));
      }
    },
    getDuration: () => audioEl?.duration ?? 0,
    getCurrentTime: () => audioEl?.currentTime ?? 0,
    setVolume: (volume: number) => {
      if (audioEl) {
        audioEl.volume = Math.max(0, Math.min(1, volume));
      }
    },
    getVolume: () => audioEl?.volume ?? 1,
  };
}
