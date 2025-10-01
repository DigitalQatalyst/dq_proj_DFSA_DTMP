import React, { useMemo } from 'react'
import { KnowledgeHubCard } from './KnowledgeHubCard'
import { useMediaSearch } from '../../hooks/UseMediaSearch'
interface KnowledgeHubGridProps {
  bookmarkedItems: string[]
  onToggleBookmark: (itemId: string) => void
  onAddToComparison?: (item: any) => void
  searchQuery?: string
  activeFilters?: string[]
  onFilterChange?: (filter: string) => void
  onClearFilters?: () => void
}
export const KnowledgeHubGrid: React.FC<KnowledgeHubGridProps> = ({
  bookmarkedItems,
  onToggleBookmark,
  onAddToComparison,
  searchQuery = '',
  activeFilters = [],
  onFilterChange,
  onClearFilters,
}) => {
  // Use our custom hook for fetching and filtering media items
  const { items, isLoading, error, hasMore, dataSource, currentPage, setPage, totalPages } = useMediaSearch({
    q: searchQuery,
    filters: activeFilters,
    pageSize: 9, // Show 9 items per page
  })
  // Get available filters based on all items
  const availableFilters = useMemo(() => {
    const mediaTypes = [...new Set(items.map((item) => item.mediaType))]
    const domains = [...new Set(items.flatMap((item) => item.tags || []))]
    return [...mediaTypes, ...domains].filter(Boolean)
  }, [items])
  // Handle filter click
  const handleFilterClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter)
    }
  }
  // Pagination helpers
  const goPrev = () => setPage(Math.max(1, currentPage - 1))
  const goNext = () => setPage(hasMore || (totalPages && currentPage < totalPages) ? currentPage + 1 : currentPage)
  const pageNumbers = (() => {
    if (!totalPages || totalPages <= 1) return [currentPage]
    const maxButtons = 7
    const pages: (number | string)[] = []
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(1)
    const left = Math.max(2, currentPage - 1)
    const right = Math.min(totalPages - 1, currentPage + 1)
    if (left > 2) pages.push('…')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 1) pages.push('…')
    pages.push(totalPages)
    return pages
  })()
  return (
    <div>
      {/* Data source badge */}
      <div className="flex justify-end mb-3">
        <span
          className={
            `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ` +
            (dataSource === 'live'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-gray-50 text-gray-600 border-gray-200')
          }
          title={dataSource === 'live' ? 'Loaded from server' : 'Loaded from local mock data'}
        >
          {dataSource === 'live' ? 'Live Data' : 'Mock Data'}
        </span>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error loading content: {error.message}</p>
          <button
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            onClick={() => window.location.reload()}
          >
            Try refreshing the page
          </button>
        </div>
      )}
      {!error && items.length === 0 && !isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item) => (
            <div key={`item-${item.id}`} className="h-full">
              <KnowledgeHubCard
                item={item}
                isBookmarked={bookmarkedItems.includes(item.id)}
                onToggleBookmark={() => onToggleBookmark(item.id)}
                onAddToComparison={
                  onAddToComparison ? () => onAddToComparison(item) : undefined
                }
              />
            </div>
          ))}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* Pagination Controls */}
      {!isLoading && items.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-3">
          <div className="text-sm text-gray-600">
            {dataSource === 'mock' && totalPages
              ? `Page ${currentPage} of ${totalPages}`
              : `Page ${currentPage}`}
          </div>
          <div className="inline-flex items-center gap-1">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded border text-sm ${
                currentPage === 1
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Prev
            </button>
            {pageNumbers.map((p, idx) =>
              typeof p === 'number' ? (
                <button
                  key={`p-${p}-${idx}`}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded border text-sm ${
                    p === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ) : (
                <span key={`dots-${idx}`} className="px-2 text-gray-400">
                  {p}
                </span>
              )
            )}
            <button
              onClick={goNext}
              disabled={!(hasMore || (totalPages && currentPage < totalPages))}
              className={`px-3 py-1.5 rounded border text-sm ${
                !(hasMore || (totalPages && currentPage < totalPages))
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default KnowledgeHubGrid
