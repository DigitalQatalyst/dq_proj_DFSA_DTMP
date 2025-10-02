import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { mediaService, MediaItem } from '../utils/supabase'
import { Toast, ToastType } from '../components/Toast'
import { ArrowLeft as ArrowLeftIcon, Save as SaveIcon, Calendar as CalendarIcon, Tag as TagIcon, X as XIcon, PlusCircle as PlusCircleIcon } from 'lucide-react'

type Tab = 'details' | 'schedule'

const MediaDetail: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('details')
  const [item, setItem] = useState<MediaItem | null>(null)
  const [formData, setFormData] = useState<Partial<MediaItem>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    if (!id) return
    const fetchItem = async () => {
      setLoading(true)
      try {
        const data = await mediaService.getMediaItemById(id)
        const normalizedTags = Array.isArray(data.tags) ? data.tags : []
        setItem({ ...data, tags: normalizedTags })
        setFormData({ ...data, tags: normalizedTags })
        try {
          const tags = await mediaService.getAvailableTags()
          const combined = Array.from(new Set([...(tags || []), ...normalizedTags]))
          setAvailableTags(combined.sort((a, b) => a.localeCompare(b)))
        } catch {
          setAvailableTags(normalizedTags.sort((a, b) => a.localeCompare(b)))
        }
        if (data.publishedAt) {
          const d = new Date(data.publishedAt)
          setScheduleDate(d.toISOString().split('T')[0])
          setScheduleTime(d.toTimeString().slice(0, 5))
        }
      } catch (e) {
        console.error('Error loading media item:', e)
        setToast({ message: 'Failed to load media item', type: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const selectedTags = useMemo(() => (Array.isArray(formData.tags) ? formData.tags : []), [formData.tags])

  const addAvailableTag = (tag: string) => {
    setAvailableTags((prev) => {
      if (prev.includes(tag)) return prev
      return [...prev, tag].sort((a, b) => a.localeCompare(b))
    })
  }

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    setFormData((prev) => {
      const current = Array.isArray(prev.tags) ? prev.tags : []
      if (current.includes(trimmed)) return prev
      return { ...prev, tags: [...current, trimmed] }
    })
    addAvailableTag(trimmed)
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.tags) ? prev.tags : []
      if (!current.includes(tag)) return prev
      return { ...prev, tags: current.filter((item) => item !== tag) }
    })
  }

  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.tags) ? prev.tags : []
      if (current.includes(tag)) {
        return { ...prev, tags: current.filter((item) => item !== tag) }
      }
      return { ...prev, tags: [...current, tag] }
    })
  }

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTag.trim()) return
    addTag(newTag)
    setNewTag('')
  }

  const filteredTags = useMemo(() => {
    if (!tagSearch.trim()) return availableTags
    const query = tagSearch.toLowerCase()
    return availableTags.filter((tag) => tag.toLowerCase().includes(query))
  }, [availableTags, tagSearch])

  const save = async () => {
    if (!id) return
    setSaving(true)
    try {
      const updated = await mediaService.updateMediaItem(id, formData)
      setItem(updated)
      setFormData(updated)
      setToast({ message: 'Saved changes', type: 'success' })
    } catch (e) {
      console.error('Save failed', e)
      setToast({ message: 'Failed to save', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const publishNow = async () => {
    if (!id || !item) return
    setSaving(true)
    try {
      const updated = await mediaService.updateMediaItem(id, {
        ...item,
        status: 'Published',
        publishedAt: new Date().toISOString(),
      })
      setItem(updated)
      setFormData(updated)
      setToast({ message: 'Published', type: 'success' })
    } catch (e) {
      console.error('Publish failed', e)
      setToast({ message: 'Failed to publish', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const unpublish = async () => {
    if (!id || !item) return
    setSaving(true)
    try {
      const updated = await mediaService.updateMediaItem(id, {
        ...item,
        status: 'Draft',
      })
      setItem(updated)
      setFormData(updated)
      setToast({ message: 'Unpublished', type: 'success' })
    } catch (e) {
      console.error('Unpublish failed', e)
      setToast({ message: 'Failed to unpublish', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const schedule = async () => {
    if (!id || !item) return
    if (!scheduleDate) {
      setToast({ message: 'Please pick a date', type: 'error' })
      return
    }
    const publishDate = scheduleTime
      ? new Date(`${scheduleDate}T${scheduleTime}:00`)
      : new Date(`${scheduleDate}T00:00:00`)
    if (publishDate < new Date()) {
      setToast({ message: 'Scheduled time cannot be in the past', type: 'error' })
      return
    }
    setSaving(true)
    try {
      const updated = await mediaService.updateMediaItem(id, {
        ...item,
        status: 'Scheduled',
        publishedAt: publishDate.toISOString(),
      })
      setItem(updated)
      setFormData(updated)
      setToast({ message: 'Scheduled for publishing', type: 'success' })
    } catch (e) {
      console.error('Schedule failed', e)
      setToast({ message: 'Failed to schedule', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const saveLabel = item?.status === 'Published' ? 'Update' : 'Save'

  return (
    <AppLayout title="Media Details">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/admin-ui/media" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to list
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={save} disabled={saving} className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              <SaveIcon className="w-4 h-4 mr-2" /> {saveLabel}
            </button>
            <button onClick={publishNow} disabled={saving} className="px-3 py-2 border rounded-md hover:bg-gray-50">Publish</button>
            <button onClick={unpublish} disabled={saving} className="px-3 py-2 border rounded-md hover:bg-gray-50">Unpublish</button>
          </div>
        </div>

        {toast && (
          <div className="mb-3">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : !item ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">Media item not found.</div>
        ) : (
          <>
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'schedule' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('schedule')}
                >
                  <span className="inline-flex items-center"><CalendarIcon className="w-4 h-4 mr-1" /> Schedule</span>
                </button>
              </nav>
            </div>

            {activeTab === 'details' && (
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input name="title" value={formData.title || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input name="slug" value={formData.slug || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Summary</label>
                  <textarea name="summary" value={formData.summary || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  {/* Lightweight rich text editor */}
                  <div className="mt-1">
                    {(() => {
                      // Lazy require to avoid SSR/import issues
                      // eslint-disable-next-line @typescript-eslint/no-var-requires
                      const RT = require('../components/RichTextEditor').default
                      return <RT value={formData.body || ''} onChange={(html: string) => setFormData((prev) => ({ ...prev, body: html }))} />
                    })()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="space-y-2">
                    {[
                      'Finance & Funding',
                      'Marketing & Sales',
                      'Technology & Innovation',
                      'Operations & Productivity',
                      'Legal & Compliance',
                      'Strategy & Growth',
                    ].map((cat) => {
                      const checked = (formData as any).category === cat
                      return (
                        <label key={cat} className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={checked}
                            onChange={(e) => {
                              const next = e.target.checked ? cat : ''
                              setFormData((p) => ({ ...(p as any), category: next }))
                            }}
                          />
                          <span>{cat}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select name="type" value={formData.type || 'Article'} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="Article">Article</option>
                      <option value="Report">Report</option>
                      <option value="Announcement">Announcement</option>
                      <option value="Event">Event</option>
                      <option value="Podcast">Podcast</option>
                      <option value="Video">Video</option>
                      <option value="Tool">Tool / Document</option>
                      <option value="Image">Image</option>
                    </select>
                  </div>
                  {/* Category is selected from the list above */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Visibility</label>
                    <select name="visibility" value={formData.visibility || 'Public'} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select name="language" value={formData.language || 'en'} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <p className="text-xs text-gray-500 mb-2">Select or add tags to improve search relevance and Knowledge Hub filtering.</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.length === 0 ? (
                      <span className="text-sm text-gray-500">No tags selected yet.</span>
                    ) : (
                      selectedTags.map((tag) => (
                        <span
                          key={`detail-selected-${tag}`}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
                        >
                          <TagIcon className="h-4 w-4" />
                          <span>{tag}</span>
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => removeTag(tag)}
                            aria-label={`Remove tag ${tag}`}
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <input
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      placeholder="Filter available tags"
                      className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-xs text-gray-400">
                      {filteredTags.length} tag{filteredTags.length === 1 ? '' : 's'} available
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.map((tag) => {
                      const isActive = selectedTags.includes(tag)
                      return (
                        <button
                          type="button"
                          key={`detail-available-${tag}`}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                            isActive
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                          }`}
                          aria-pressed={isActive}
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                  <form className="mt-4 flex flex-col sm:flex-row gap-3" onSubmit={handleAddCustomTag}>
                    <input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add custom tag"
                      className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <PlusCircleIcon className="h-4 w-4" /> Add tag
                    </button>
                  </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SEO Title</label>
                    <input
                      name="seoTitle"
                      value={formData.seoTitle || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Canonical URL</label>
                    <input
                      name="canonicalUrl"
                      type="url"
                      value={formData.canonicalUrl || ''}
                      onChange={handleChange}
                      placeholder="https://example.com/path-to-original"
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">SEO Description</label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription || ''}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                  <div><span className="font-medium">Status:</span> {item.status}</div>
                  <div><span className="font-medium">Published:</span> {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '-'}</div>
                  <div><span className="font-medium">Updated:</span> {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}</div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="bg-white rounded-lg shadow p-6 space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Publish Date (UTC)</label>
                  <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Publish Time (UTC)</label>
                  <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex gap-2">
                  <button onClick={schedule} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Schedule Publish</button>
                  <button onClick={() => { setScheduleDate(''); setScheduleTime('') }} className="px-4 py-2 border rounded-md hover:bg-gray-50">Clear</button>
                </div>
                <p className="text-sm text-gray-500">Scheduled items will appear as "Scheduled" until the publish time.</p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default MediaDetail

