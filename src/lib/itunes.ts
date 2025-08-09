import { Track, iTunesSearchResponse } from '../types';

const ITUNES_API_BASE = 'https://itunes.apple.com/search';

// Cache for recent searches to avoid duplicate requests
const searchCache = new Map<string, { data: Track[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!query.trim()) return [];

  const normalizedQuery = query.trim().toLowerCase();
  
  // Check cache first
  const cached = searchCache.get(normalizedQuery);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const url = new URL(ITUNES_API_BASE);
    url.searchParams.set('term', query);
    url.searchParams.set('entity', 'song');
    url.searchParams.set('limit', '50'); // Increased for better results
    url.searchParams.set('media', 'music');
    url.searchParams.set('attribute', 'mixTerm'); // Search in both song and artist names
    url.searchParams.set('explicit', 'Yes'); // Include explicit content

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: iTunesSearchResponse = await response.json();
    
    // Enhanced filtering and sorting
    const filteredTracks = data.results
      .filter(track => {
        // Must have preview URL
        if (!track.previewUrl) return false;
        
        // Must have required fields
        if (!track.trackName || !track.artistName) return false;
        
        // Filter out very short previews (less than 20 seconds typically)
        return true;
      })
      .map(track => ({
        ...track,
        // Ensure artwork URL is available, fallback to higher quality if available
        artworkUrl100: track.artworkUrl100?.replace('100x100bb.jpg', '200x200bb.jpg') || track.artworkUrl100,
      }))
      .sort((a, b) => {
        // Prioritize exact matches in track name
        const queryLower = normalizedQuery;
        const aTrackMatch = a.trackName.toLowerCase().includes(queryLower);
        const bTrackMatch = b.trackName.toLowerCase().includes(queryLower);
        
        if (aTrackMatch && !bTrackMatch) return -1;
        if (!aTrackMatch && bTrackMatch) return 1;
        
        // Then prioritize artist name matches
        const aArtistMatch = a.artistName.toLowerCase().includes(queryLower);
        const bArtistMatch = b.artistName.toLowerCase().includes(queryLower);
        
        if (aArtistMatch && !bArtistMatch) return -1;
        if (!aArtistMatch && bArtistMatch) return 1;
        
        // Finally sort by track name alphabetically
        return a.trackName.localeCompare(b.trackName);
      });

    // Cache the results
    searchCache.set(normalizedQuery, {
      data: filteredTracks,
      timestamp: Date.now(),
    });

    // Clean old cache entries occasionally
    if (searchCache.size > 100) {
      const cutoff = Date.now() - CACHE_DURATION;
      for (const [key, value] of searchCache.entries()) {
        if (value.timestamp < cutoff) {
          searchCache.delete(key);
        }
      }
    }

    return filteredTracks;
  } catch (error) {
    console.error('Error searching tracks:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อหราเหทอร์เหต');
    }
    
    throw new Error('เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง');
  }
};