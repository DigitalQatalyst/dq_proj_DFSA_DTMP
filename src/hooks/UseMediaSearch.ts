import { useState, useEffect, useCallback } from 'react'
import { getFallbackKnowledgeHubItems } from '../utils/fallbackData'
import { mapApiItemToCardProps } from '../utils/mediaMappers'
import { getSupabase } from '../admin-ui/utils/supabaseClient'
export interface MediaSearchParams {
  q?: string
  filters?: string[]
  pageSize?: number
  cursor?: string
}
export interface MediaSearchResult {
  items: any[]
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  nextCursor: string | null
  loadMore: () => void
  refetch: () => void
}
/**
 * Hook for searching and paginating through media items
 */
export function useMediaSearch({
  q = '',
  filters = [],
  pageSize = 10,
  cursor = null,
}: MediaSearchParams = {}): MediaSearchResult {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [nextCursor, setNextCursor] = useState<string | null>(cursor)
  const [currentPage, setCurrentPage] = useState<number>(1)
  // Fetch items from Supabase (published + public), fallback to local data when unavailable
  const fetchItems = useCallback(
    async (reset: boolean = false) => {
      try {
        setIsLoading(true)
        setError(null)

        // Try Supabase first
        let usedSupabase = false
        try {
          const supabase = getSupabase()
          const from = reset ? 0 : (currentPage - 1) * pageSize
          const to = reset ? pageSize - 1 : currentPage * pageSize - 1
          let query = supabase
            .from('media_items')
            .select('*', { count: 'exact' })
            .eq('status', 'Published')
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false })
            .order('updated_at', { ascending: false })

          // Only include Public if the column exists and is used
          query = query.eq('visibility', 'Public')

          if (q) {
            const search = q.replace(/%/g, '')
            query = query.or(
              `title.ilike.%${search}%,summary.ilike.%${search}%`
            )
          }
          // Filter by type if provided (map filters directly to `type`)
          const typeFilters = (filters || []).filter((f) => KNOWN_TYPES.includes(String(f))) as string[]
          if (typeFilters.length > 0) {
            query = query.in('type', typeFilters as string[])
          }

                              // Tag filters (JSONB array) � match ANY selected tag
          const tagFilters = (filters || []).filter((f) => !KNOWN_TYPES.includes(String(f))) as string[]
          if (tagFilters.length > 0) {
            const parts = tagFilters.map((t) => {
              const safe = String(t).replace(/\"/g, '\\"')
              return `tags.cs.["${safe}"]`
            })
            if (parts.length > 0) {
              query = query.or(parts.join(','))
            }
          }const { data, error, count } = await query.range(from, to)
          if (error) throw error
          usedSupabase = true

          const mapped = (data || []).map((row: any) =>
            mapApiItemToCardProps({
              id: row.id,
              title: row.title,
              description: row.summary,
              mediaType: row.type,
              provider: { name: row.provider_name || 'Knowledge Hub', logoUrl: row.provider_logo_url || null },
              imageUrl: row.image_url || null,
              videoUrl: row.video_url || null,
              audioUrl: row.audio_url || null,
              tags: (row as any).tags || [],
              date: row.published_at,
              lastUpdated: row.updated_at,
            })
          )

          if (reset) {
            setItems(mapped)
          } else {
            setItems((prev) => [...prev, ...mapped])
          }
          const fetchedSoFar = (reset ? 0 : (currentPage - 1) * pageSize) + mapped.length
          setHasMore(typeof count === 'number' ? fetchedSoFar < count : mapped.length === pageSize)
          setNextCursor(mapped.length === pageSize ? `page_${currentPage + 1}` : null)
          setIsLoading(false)
          return
        } catch (e) {
          // If Supabase is not configured or errors, fall back to local
          if (usedSupabase) {
            // If a real fetch failed mid-way, surface the error
            console.warn('Supabase fetch failed, falling back to local data', e)
          }
        }

        // Fallback: local mock dataset
        let allItems = getFallbackKnowledgeHubItems()
        // Apply search filter
        if (q) {
          const searchQuery = q.toLowerCase()
          allItems = allItems.filter(
            (item) =>
              item.title.toLowerCase().includes(searchQuery) ||
              item.description.toLowerCase().includes(searchQuery) ||
              (item.provider?.name && item.provider.name.toLowerCase().includes(searchQuery)) ||
              (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery))),
          )
        }
        // Apply filters (by tags and mediaType)
        if (filters && filters.length > 0) {
          allItems = allItems.filter((item) => {
            const itemTags = [...(item.tags || []), item.filterType || item.mediaType]
            return filters.some((filter) => itemTags.includes(filter))
          })
        }
        // Sort newest first (by date/lastUpdated)
        const toDate = (it: any) => new Date(it.date || it.lastUpdated || 0).getTime()
        allItems.sort((a, b) => toDate(b) - toDate(a))
        // Paginate
        const startIndex = reset ? 0 : (currentPage - 1) * pageSize
        const endIndex = reset ? pageSize : currentPage * pageSize
        const paginatedItems = allItems.slice(startIndex, endIndex)
        const moreItems = endIndex < allItems.length
        const cursor = moreItems ? `page_${currentPage + 1}` : null
        if (reset) {
          setItems(paginatedItems.map(mapApiItemToCardProps))
        } else {
          setItems((prev) => [...prev, ...paginatedItems.map(mapApiItemToCardProps)])
        }
        setHasMore(moreItems)
        setNextCursor(cursor)
        setIsLoading(false)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('An error occurred while fetching data'),
        )
        setIsLoading(false)
      }
    },
    [q, filters, pageSize, currentPage],
  )
  // Initial fetch
  useEffect(() => {
    setCurrentPage(1)
    fetchItems(true)
  }, [q, filters, pageSize])
  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [isLoading, hasMore])
  // Load more when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchItems(false)
    }
  }, [currentPage])
  // Refetch function
  const refetch = useCallback(() => {
    setCurrentPage(1)
    fetchItems(true)
  }, [fetchItems])
  return {
    items,
    isLoading,
    error,
    hasMore,
    nextCursor,
    loadMore,
    refetch,
  }
}





