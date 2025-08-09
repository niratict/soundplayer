export interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
}

export interface iTunesSearchResponse {
  resultCount: number;
  results: Track[];
}

export interface PlayerState {
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

export interface PlayerActions {
  setQueue: (queue: Track[], startIndex?: number) => void;
  playAt: (index: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  updateTime: (currentTime: number, duration: number) => void;
  setLoading: (loading: boolean) => void;
}