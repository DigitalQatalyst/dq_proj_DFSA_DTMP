import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { mediaService, MediaItem } from '../utils/supabase'
import { Check as CheckIcon, X as XIcon, Tag as TagIcon, PlusCircle as PlusCircleIcon } from 'lucide-react'
import { Toast, ToastType } from '../components/Toast'

type MediaFormData = Partial<MediaItem>

const MediaCreate: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<MediaFormData>({
    title: '',
    slug: '',
    summary: '',
    body: '',
    type: 'Article',
    language: 'en',
    visibility: 'Public',
    status: 'Draft',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    tags: [],
  })
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [tagSearch, setTagSearch] = useState('')
  const [newTag, setNewTag] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  useEffect(() => {
    let shouldUpdate = true
    ;(async () => {
      try {
        const tags = await mediaService.getAvailableTags()
        if (shouldUpdate) {
          setAvailableTags(tags.sort((a, b) => a.localeCompare(b)))
        }
      } catch (error) {
        console.warn('Failed to load available tags', error)
      }
    })()
    return () => {
      shouldUpdate = false
    }
  }, [])

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    if (name === 'title') {
      setFormData((prev) => ({ ...prev, title: value, slug: generateSlug(value) }))
      return
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload: MediaFormData = {
        ...formData,
        tags: selectedTags,
      }
      const newMediaItem = await mediaService.createMediaItem(payload)
      setToast({ message: 'Media item created successfully!', type: 'success' })
      setTimeout(() => {
        navigate(`/admin-ui/media/${newMediaItem.id}`)
      }, 1200)
    } catch (error) {
      console.error('Error creating media item:', { error, formData })
      setToast({ message: 'Failed to create media item', type: 'error' })
      setSubmitting(false)
    }
  }

  const validateStep1 = () => Boolean(formData.title && formData.slug && formData.type && formData.summary)

  return (
    <AppLayout title="Create New Media Item">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-500 mt-1">Add a new piece of content to your knowledge library</p>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  step >= 1 ? 'bg-blue-600' : 'bg-gray-300'
                } text-white`}
              >
                {step > 1 ? <CheckIcon className="h-6 w-6" /> : 1}
              </div>
              <div className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                Basic Information
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  step >= 2 ? 'bg-blue-600' : 'bg-gray-300'
                } text-white`}
              >
                {step > 2 ? <CheckIcon className="h-6 w-6" /> : 2}
              </div>
              <div className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                SEO & Metadata
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      URL-friendly identifier. Auto-generated from the title (you can adjust before saving).
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="Article">Article</option>
                        <option value="Report">Report</option>
                        <option value="Announcement">Announcement</option>
                        <option value="Event">Event</option>
                        <option value="Podcast">Podcast</option>
                        <option value="Video">Video</option>
                        <option value="Tool">Tool / Document</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        Language <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                      Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="summary"
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                      Content Body
                    </label>
                    <textarea
                      id="body"
                      name="body"
                      value={formData.body}
                      onChange={handleChange}
                      rows={10}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select all tags that apply. Tags help the Knowledge Hub filter and surface this media item.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.length === 0 ? (
                      <span className="text-sm text-gray-500">No tags selected yet.</span>
                    ) : (
                      selectedTags.map((tag) => (
                        <span
                          key={`selected-${tag}`}
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
                          key={`available-${tag}`}
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
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-md"
                    onClick={() => setStep(2)}
                    disabled={!validateStep1()}
                  >
                    Next
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    disabled={!validateStep1() || submitting}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                      SEO Title
                    </label>
                    <input
                      id="seoTitle"
                      name="seoTitle"
                      value={formData.seoTitle || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
                      SEO Description
                    </label>
                    <textarea
                      id="seoDescription"
                      name="seoDescription"
                      value={formData.seoDescription || ''}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700">
                      Canonical URL
                    </label>
                    <input
                      id="canonicalUrl"
                      name="canonicalUrl"
                      type="url"
                      placeholder="https://example.com/path-to-original"
                      value={formData.canonicalUrl || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional canonical reference for search engines when this content originates elsewhere.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button type="button" className="px-4 py-2 border rounded-md" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    disabled={submitting}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </AppLayout>
  )
}

export default MediaCreate
