// Import necessary dependencies
import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Search component for finding and displaying music tracks
 * Handles search functionality with debouncing and displays results in an animated list
 */
const Search = () => {
  // State management for search functionality
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  /**
   * Debounce utility function to limit API calls
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  /**
   * Fetches music data from the LRCLIB API
   * @param {string} searchQuery - Search term to query the API
   */
  const searchMusic = async (searchQuery) => {
    try {
      setLoading(true)
      const response = await axios.get(`https://lrclib.net/api/search?q=${searchQuery}`)
      setResults(response.data)
    } catch (error) {
      console.error('Error searching music:', error)
    } finally {
      setLoading(false)
    }
  }

  // Debounced search function with 700ms delay
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery) {
        searchMusic(searchQuery)
      } else {
        setResults([])
      }
    }, 700),
    []
  )

  /**
   * Handles search input changes
   * @param {Event} e - Input change event
   */
  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  /**
   * Formats duration in seconds to MM:SS format
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration string
   */
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className='h-full flex flex-col items-center justify-start p-4 gap-4 overflow-hidden'>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-5xl space-y-6 h-full flex flex-col'
      >
        {/* Search input container with label */}
        <LabelInputContainer>
          <Label className="bg-clip-text text-transparent text-center bg-gradient-to-t from-neutral-900 to-neutral-700 dark:from-neutral-950 dark:to-white text-2xl md:text-4xl lg:text-5xl font-sans py-2 md:py-4 relative z-20 font-bold tracking-tight" htmlFor="i/p">Perfer songs with English Lyrics</Label>
          <Input
            id="i/p"
            type="text"
            placeholder='Search for music...'
            value={query}
            onChange={handleSearch}
            className='w-full text-lg md:text-xl h-12 md:h-14 p-4'
          />
        </LabelInputContainer>
        
        {/* Loading indicator */}
        {loading && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center mt-6'
          >
            Searching...
          </motion.p>
        )}
        
        {/* Results list with animations */}
        <AnimatePresence>
          <div className='flex-1 max-h-[calc(100vh-17rem)] overflow-y-auto select-none px-1 space-y-4'>
            {Boolean(results.length) && results.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className='w-full bg-black/30 hover:bg-white/5 border border-white/30'>
                  <CardHeader className='p-4'>
                    <CardTitle className='text-base md:text-lg'>{track.name}</CardTitle>
                  </CardHeader>
                  <CardContent className='p-4'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                      <div className='space-y-2'>
                        <p className='text-sm text-gray-400'>Artist: {track.artistName}</p>
                        <p className='text-sm text-gray-400'>Album: {track.albumName}</p>
                        <p className='text-sm text-gray-400'>Duration: {formatDuration(track.duration)}</p>
                        <p className='text-sm text-gray-400 max-h-10 overflow-hidden'>Lyrics : {track.plainLyrics}</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          className='cursor-pointer hover:bg-white/50'
                          onClick={() => router.push(`/player/${track.id}`)}
                        >
                          Play
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Search

/**
 * Container component for label and input elements
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.className - Additional CSS classes
 */
const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};