// src/lib/itunes.ts
import type { Track } from '../types'

export async function searchSongs(term: string, signal?: AbortSignal): Promise<Track[]> {
  const url = new URL('https://itunes.apple.com/search')
  url.searchParams.set('term', term)
  url.searchParams.set('entity', 'song')
  url.searchParams.set('limit', '6')

  const res = await fetch(url.toString(), { signal })
  if (!res.ok) throw new Error(`iTunes API error: ${res.status}`)
  const data = await res.json()
  return (data.results || []).map((r: any) => ({
    trackId: r.trackId,
    trackName: r.trackName,
    artistName: r.artistName,
    artworkUrl100: r.artworkUrl100,
    previewUrl: r.previewUrl,
  })) as Track[]
}