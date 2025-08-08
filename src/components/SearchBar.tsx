// src/components/SearchBar.tsx
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchSongs } from '../lib/itunes'
import type { Track } from '../types'

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value)
  useMemo(() => {
    const id = setTimeout(() => setV(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return v
}

type Props = {
  onPickResults: (tracks: Track[]) => void
}

export default function SearchBar({ onPickResults }: Props) {
  const [term, setTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const debounced = useDebounced(term, 300)

  const q = useQuery({
    queryKey: ['search', debounced],
    queryFn: ({ signal }) => debounced ? searchSongs(debounced, signal) : Promise.resolve([]),
    enabled: debounced.length > 0,
    staleTime: 60_000,
  })

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
      <div className="relative">
        <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
          {/* Search icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            data-testid="search-input"
            className={`w-full pl-12 pr-4 py-4 bg-slate-800 text-white rounded-xl border-2 transition-all duration-300 placeholder-slate-400 text-lg ${
              isFocused 
                ? 'border-purple-400 shadow-lg shadow-purple-400/20' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
            placeholder="ค้นหาเพลงที่คุณชื่นชอบ..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          {/* Clear button */}
          {term && (
            <button
              onClick={() => setTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Loading state */}
        {q.isPending && (
          <div className="mt-4 flex items-center gap-3 text-slate-300">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-400 border-t-transparent"></div>
            <span>กำลังค้นหา...</span>
          </div>
        )}

        {/* Error state */}
        {q.error && (
          <div className="mt-4 flex items-center gap-3 text-red-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>เกิดข้อผิดพลาดในการค้นหา</span>
          </div>
        )}

        {/* Results button */}
        {q.data && q.data.length > 0 && (
          <div className="mt-6">
            <button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-400/20 flex items-center justify-center gap-3"
              onClick={() => onPickResults(q.data!)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l6-6v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
              สร้างเพลย์ลิสต์ ({q.data.length} เพลง)
            </button>
          </div>
        )}

        {/* No results */}
        {debounced && q.data && q.data.length === 0 && !q.isPending && (
          <div className="mt-4 text-slate-400 text-center py-4">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.903-6.047 2.379L5.5 15.5C4.119 14.119 4.119 11.881 5.5 10.5L6.953 9.047A7.962 7.962 0 0112 9c2.34 0 4.467-.903 6.047-2.379L18.5 8.5c1.381 1.381 1.381 3.619 0 5l-1.453 1.453z" />
            </svg>
            <p>ไม่พบเพลงที่ตรงกับคำค้นหา</p>
            <p className="text-sm mt-1">ลองใช้คำค้นหาอื่น</p>
          </div>
        )}
      </div>
    </div>
  )
}