import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { mediaService, MediaItem } from '../utils/supabase'
import { Plus as PlusIcon, Edit as EditIcon, Clock as ClockIcon, CheckCircle as CheckCircleIcon, Archive as ArchiveIcon, X as XIcon } from 'lucide-react'

interface StatusCardProps {
  title: string
  count: number
  icon: React.ReactNode
  color: string
  onClick?: () => void
  isActive?: boolean
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count, icon, color, onClick, isActive = false }) => (
  <div
    className={`bg-white rounded-lg shadow p-6 border-t-4 ${color} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    onClick={onClick}
    tabIndex={onClick ? 0 : undefined}
    role={onClick ? 'button' : undefined}
    aria-pressed={isActive ? 'true' : undefined}
    onKeyDown={(e) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick()
      }
    }}
  >
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <div className={`p-2 rounded-full ${color.replace('border', 'bg').replace('-500', '-100')}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold mt-auto">{count}</p>
    </div>
  </div>
)

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({ Draft: 0, InReview: 0, Scheduled: 0, Published: 0, Archived: 0 })
  const [recentItems, setRecentItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const counts = await mediaService.getStatusCounts()
        setStatusCounts(counts)
        const { data } = await mediaService.getMediaItems({}, 1, 5, { field: 'updatedAt', direction: 'desc' })
        setRecentItems(data)
      } catch (e) {
        console.error('Error fetching dashboard data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleStatusCardClick = (status: string) => {
    setActiveFilter(status)
    navigate(`/admin-ui/media?status=${status}`)
  }

  const handleClearFilter = () => setActiveFilter(null)

  return (
    <AppLayout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Media Status Overview</h2>
        <p className="text-gray-500 mt-1">Welcome to the Media Admin Hub</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {activeFilter && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex justify-between items-center">
              <span className="text-blue-700 font-medium">Filtering by: {activeFilter}</span>
              <button onClick={handleClearFilter} className="text-blue-700 hover:text-blue-800 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
                <XIcon className="w-4 h-4 mr-1" /> Clear Filter
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <StatusCard title="Draft" count={statusCounts.Draft} icon={<PlusIcon className="h-6 w-6 text-blue-500" />} color="border-blue-500" onClick={() => handleStatusCardClick('Draft')} isActive={activeFilter === 'Draft'} />
            <StatusCard title="In Review" count={statusCounts.InReview} icon={<EditIcon className="h-6 w-6 text-yellow-500" />} color="border-yellow-500" onClick={() => handleStatusCardClick('InReview')} isActive={activeFilter === 'InReview'} />
            <StatusCard title="Scheduled" count={statusCounts.Scheduled} icon={<ClockIcon className="h-6 w-6 text-purple-500" />} color="border-purple-500" onClick={() => handleStatusCardClick('Scheduled')} isActive={activeFilter === 'Scheduled'} />
            <StatusCard title="Published" count={statusCounts.Published} icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />} color="border-green-500" onClick={() => handleStatusCardClick('Published')} isActive={activeFilter === 'Published'} />
            <StatusCard title="Archived" count={statusCounts.Archived} icon={<ArchiveIcon className="h-6 w-6 text-gray-500" />} color="border-gray-500" onClick={() => handleStatusCardClick('Archived')} isActive={activeFilter === 'Archived'} />
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentItems.length === 0 ? (
                <div className="px-6 py-4 text-center text-gray-500">No recent activity found.</div>
              ) : (
                recentItems.map((item) => (
                  <div key={item.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-md font-medium text-gray-900">
                          <Link to={`/admin-ui/media/${item.id}`} className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                            {item.title}
                          </Link>
                        </h4>
                        <p className="text-sm text-gray-500">{item.type} • {item.status}</p>
                      </div>
                      <div className="text-sm text-gray-500">{new Date(item.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  )
}

export default Dashboard

