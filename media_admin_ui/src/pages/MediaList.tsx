import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../components/KFHeader';
import { mediaService, MediaItem } from '../utils/supabase';
import { PlusIcon, SearchIcon, FilterIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon, SortAscIcon, SortDescIcon, XIcon } from 'lucide-react';
const MediaList: React.FC = () => {
  const {
    user
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    language: '',
    visibility: ''
  });
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState({
    field: 'publishedAt',
    direction: 'desc'
  });
  const itemsPerPage = 10;
  // Get filter from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusFilter = params.get('status');
    const typeFilter = params.get('type');
    const languageFilter = params.get('language');
    const visibilityFilter = params.get('visibility');
    const searchFilter = params.get('search');
    const newFilters = {
      ...filters
    };
    if (statusFilter) {
      newFilters.status = statusFilter;
    }
    if (typeFilter) {
      newFilters.type = typeFilter;
    }
    if (languageFilter) {
      newFilters.language = languageFilter;
    }
    if (visibilityFilter) {
      newFilters.visibility = visibilityFilter;
    }
    setFilters(newFilters);
    if (searchFilter) {
      setSearchQuery(searchFilter);
    }
  }, [location.search]);
  // Simple role check - in a real app this would be more sophisticated
  const canCreate = user !== null;
  useEffect(() => {
    const fetchMediaItems = async () => {
      setLoading(true);
      try {
        const {
          data,
          count
        } = await mediaService.getMediaItems({
          ...filters,
          search: searchQuery
        }, page, itemsPerPage, orderBy);
        setMediaItems(data);
        setTotalItems(count);
      } catch (error) {
        console.error('Error fetching media items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMediaItems();
  }, [filters, searchQuery, page, orderBy]);
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
    // Update URL query parameter
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    navigate(`/admin-ui/media?${params.toString()}`);
  };
  const clearFilters = () => {
    setFilters({
      status: '',
      type: '',
      language: '',
      visibility: ''
    });
    setSearchQuery('');
    navigate('/admin-ui/media');
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // Update URL query parameter
    const params = new URLSearchParams(location.search);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };
  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedItems.length === mediaItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mediaItems.map(item => item.id));
    }
  };
  const exportSelectedToCsv = () => {
    // In a real app, this would generate and download a CSV
    console.log('Exporting items:', selectedItems);
    alert(`Exporting ${selectedItems.length} items to CSV`);
  };
  const handleSort = (field: string) => {
    setOrderBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    setPage(1);
  };
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return <AppLayout title="Media Library">
      <div className="flex justify-between items-center mb-6">
        
        {canCreate && <Link to="/media/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <PlusIcon className="w-5 h-5 mr-2" />
            New Media Item
          </Link>}
      </div>
      {/* Active Filters */}
      {Object.values(filters).some(value => value) && <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <span className="text-blue-700 font-medium">Active filters:</span>
            {filters.status && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
                Status: {filters.status}
                <button className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded" onClick={() => handleFilterChange('status', '')} aria-label={`Remove ${filters.status} status filter`}>
                  <XIcon className="w-3 h-3" />
                </button>
              </span>}
            {filters.type && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
                Type: {filters.type}
                <button className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded" onClick={() => handleFilterChange('type', '')} aria-label={`Remove ${filters.type} type filter`}>
                  <XIcon className="w-3 h-3" />
                </button>
              </span>}
            {filters.visibility && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
                Visibility: {filters.visibility}
                <button className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded" onClick={() => handleFilterChange('visibility', '')} aria-label={`Remove ${filters.visibility} visibility filter`}>
                  <XIcon className="w-3 h-3" />
                </button>
              </span>}
            {filters.language && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
                Language: {filters.language}
                <button className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded" onClick={() => handleFilterChange('language', '')} aria-label={`Remove ${filters.language} language filter`}>
                  <XIcon className="w-3 h-3" />
                </button>
              </span>}
          </div>
          <button onClick={clearFilters} className="text-blue-700 hover:text-blue-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1">
            Clear all filters
          </button>
        </div>}
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input type="text" placeholder="Search by title..." className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon className="w-5 h-5" />
              </div>
            </div>
          </form>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select className="border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} aria-label="Filter by status">
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="InReview">In Review</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
            <select className="border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" value={filters.type} onChange={e => handleFilterChange('type', e.target.value)} aria-label="Filter by type">
              <option value="">All Types</option>
              <option value="Article">Article</option>
              <option value="Report">Report</option>
              <option value="Announcement">Announcement</option>
              <option value="Event">Event</option>
              <option value="Podcast">Podcast</option>
            </select>
            <select className="border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" value={filters.visibility} onChange={e => handleFilterChange('visibility', e.target.value)} aria-label="Filter by visibility">
              <option value="">All Visibility</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
            <select className="border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" value={filters.language} onChange={e => handleFilterChange('language', e.target.value)} aria-label="Filter by language">
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedItems.length > 0 && <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex justify-between items-center">
          <span className="text-blue-700 font-medium">
            {selectedItems.length} items selected
          </span>
          <button onClick={exportSelectedToCsv} className="text-blue-700 hover:text-blue-800 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1">
            <DownloadIcon className="w-4 h-4 mr-1" />
            Export as CSV
          </button>
        </div>}
      {/* Media Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div> : <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" checked={selectedItems.length === mediaItems.length && mediaItems.length > 0} onChange={toggleSelectAll} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" aria-label="Select all items" />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('publishedAt')} aria-label="Sort by published date">
                  <div className="flex items-center">
                    Published At
                    {orderBy.field === 'publishedAt' && (orderBy.direction === 'desc' ? <SortDescIcon className="h-4 w-4 ml-1" /> : <SortAscIcon className="h-4 w-4 ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('updatedAt')} aria-label="Sort by updated date">
                  <div className="flex items-center">
                    Updated At
                    {orderBy.field === 'updatedAt' && (orderBy.direction === 'desc' ? <SortDescIcon className="h-4 w-4 ml-1" /> : <SortAscIcon className="h-4 w-4 ml-1" />)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mediaItems.length === 0 ? <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No media items found. Try adjusting your filters or create a
                    new item.
                  </td>
                </tr> : mediaItems.map(item => <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelectItem(item.id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" aria-label={`Select ${item.title}`} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/admin-ui/media/${item.id}`} className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Draft' ? 'bg-gray-100 text-gray-800' : item.status === 'InReview' ? 'bg-yellow-100 text-yellow-800' : item.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' : item.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.visibility}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>)}
            </tbody>
          </table>}
        {/* Pagination */}
        {totalPages > 1 && <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(page - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(page * itemsPerPage, totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'}`} aria-label="Previous page">
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({
                length: Math.min(5, totalPages)
              }).map((_, i) => {
                // Calculate page numbers to show (current page and surrounding pages)
                let pageNum = page;
                if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                if (pageNum <= totalPages) {
                  return <button key={pageNum} onClick={() => setPage(pageNum)} className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${page === pageNum ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'}`} aria-label={`Page ${pageNum}`} aria-current={page === pageNum ? 'page' : undefined}>
                          {pageNum}
                        </button>;
                }
                return null;
              })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'}`} aria-label="Next page">
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>}
      </div>
    </AppLayout>;
};
export default MediaList;
