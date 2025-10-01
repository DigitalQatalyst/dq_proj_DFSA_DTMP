import { useState, useEffect, useCallback } from 'react'
import { getFallbackKnowledgeHubItems } from '../utils/fallbackData'
import { fetchKnowledgeHubItems } from '../services/knowledgeHub'
import { mapApiItemToCardProps } from '../utils/mediaMappers'
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
  dataSource: 'live' | 'mock'
  // Pagination controls
  currentPage: number
  setPage: (page: number) => void
  totalPages: number | null
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
  const [dataSource, setDataSource] = useState<'live' | 'mock'>('mock')
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Simulated API call with pagination, search, and filtering
  const fetchItems = useCallback(
    async (reset: boolean = false) => {
      try {
        // Start loading
        setIsLoading(true)
        setError(null)
        // Try server first
        try {
          const page = reset ? 1 : currentPage
          const serverItems = await fetchKnowledgeHubItems({ search: q, pageSize, page })
          if (Array.isArray(serverItems) && serverItems.length > 0) {
            // LIVE: trust server pagination and ordering
            setDataSource('live')
            setItems(serverItems.map(mapApiItemToCardProps))
            setHasMore(serverItems.length === pageSize)
            setNextCursor(serverItems.length === pageSize ? `page_${page + 1}` : null)
            setTotalPages(null) // unknown without a count endpoint
            setIsLoading(false)
            return
          }
        } catch (e) {
          // ignore and fallback
        }
        // MOCK: fallback to local dataset with client-side paging + sorting
        setDataSource('mock')
        let allItems: any[] = getFallbackKnowledgeHubItems()
        // Apply search filter if query exists
        if (q) {
          const searchQuery = q.toLowerCase()
          allItems = allItems.filter(
            (item) =>
              item.title.toLowerCase().includes(searchQuery) ||
              item.description.toLowerCase().includes(searchQuery) ||
              (item.provider?.name &&
                item.provider.name.toLowerCase().includes(searchQuery)) ||
              (item.tags &&
                item.tags.some((tag) =>
                  tag.toLowerCase().includes(searchQuery),
                )),
          )
        }
        // Apply tag/type filters
        if (filters && filters.length > 0) {
          allItems = allItems.filter((item) => {
            const itemTags = [...(item.tags || []), item.mediaType]
            return filters.some((filter) => itemTags.includes(filter))
          })
        }
        // Sort newest first using available date fields
        const toDate = (it: any) => new Date(it.date || it.publishedAt || it.lastUpdated || 0).getTime()
        allItems.sort((a, b) => (toDate(b) - toDate(a)))
        // Calculate pagination for mock data
        const totalItems = allItems.length
        const total = Math.max(1, Math.ceil(totalItems / pageSize))
        const page = reset ? 1 : currentPage
        const startIndex = (page - 1) * pageSize
        const endIndex = page * pageSize
        const paginatedItems = allItems.slice(startIndex, endIndex)
        setItems(paginatedItems.map(mapApiItemToCardProps))
        setHasMore(page < total)
        setNextCursor(page < total ? `page_${page + 1}` : null)
        setTotalPages(total)
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
  // Reset to page 1 when inputs change; fetching handled by currentPage effect
  useEffect(() => {
    setCurrentPage(1)
  }, [q, filters, pageSize])
  // Load more function (kept for compatibility; advances to next page)
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [isLoading, hasMore])
  // Fetch whenever current page changes (forward or backward)
  useEffect(() => {
    fetchItems(currentPage === 1)
  }, [currentPage, fetchItems])
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
    dataSource,
    currentPage,
    setPage: setCurrentPage,
    totalPages,
  }
}
