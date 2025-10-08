import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { mediaService, MediaItem, assetService } from '../utils/supabase';
import {
  Check as CheckIcon,
  X as XIcon,
  Tag as TagIcon,
  PlusCircle as PlusCircleIcon,
} from 'lucide-react';
import { Toast, ToastType } from '../components/Toast';
import DOMPurify from 'dompurify';
import RichTextEditor from '../components/RichTextEditor';

type MediaFormData = Partial<MediaItem> & {
  videoUrl?: string;
  duration?: string;
  podcastUrl?: string;
  episodeNumber?: string;
  eventDate?: string;
  eventLocation?: string;
  eventTime?: string;
  eventLocationDetails?: string;
  eventRegistrationInfo?: string;
  eventAgenda?: any;
  announcementDate?: string;
  downloadUrl?: string;
  fileSize?: string;
  author?: string;
  source?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
};

interface MediaCreateProps {
  existingItem?: MediaItem;
}

const isHttpUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

type TabKey = 'Article' | 'Video' | 'Podcast' | 'Report' | 'News' | 'Guide' | 'Event' | 'Toolkit';

const tabs: { key: TabKey; label: string; description: string }[] = [
  { key: 'Article', label: 'Articles', description: 'Write and format articles' },
  { key: 'News', label: 'News', description: 'Quick news updates and announcements' },
  { key: 'Guide', label: 'Guides', description: 'How-to guides and tutorials' },
  { key: 'Video', label: 'Videos', description: 'Video content with preview' },
  { key: 'Podcast', label: 'Podcasts', description: 'Audio or video podcast episodes' },
  { key: 'Event', label: 'Events', description: 'Upcoming events and webinars' },
  { key: 'Report', label: 'Reports', description: 'Reports and documents (PDF/DOCX)' },
  { key: 'Toolkit', label: 'Toolkits & Templates', description: 'Downloadable templates and tools' },
];

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const isValidSlug = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim());

const isValidUrl = (url: string) => {
  if (!url) return true;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const isYouTubeUrl = (url: string) =>
  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)\w+/i.test(url || '');

const getYouTubeEmbedSrc = (url: string) => {
  try {
    const u = new URL(url);
    let id = '';
    if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1);
    else if (u.searchParams.get('v')) id = u.searchParams.get('v') || '';
    else if (u.pathname.includes('/embed/')) id = u.pathname.split('/embed/')[1];
    return id ? 'https://www.youtube.com/embed/' + id : '';
  } catch {
    return '';
  }
};

const isVimeoUrl = (url: string) => /vimeo\.com\/(\d+)/i.test(url || '');

const getVimeoEmbedSrc = (url: string) => {
  const m = (url || '').match(/vimeo\.com\/(\d+)/i);
  return m && m[1] ? 'https://player.vimeo.com/video/' + m[1] : '';
};

const isAudioUrl = (url: string) => /\.(mp3|m4a|aac|wav|ogg)$/i.test(url || '');
const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov|mkv|m3u8)$/i.test(url || '');

const formatTime = (sec: number) => {
  if (!isFinite(sec) || sec <= 0) return '';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m + ':' + (s < 10 ? '0' + s : s);
};

const getTextFromHTML = (html?: string) => {
  if (!html) return '';
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || d.innerText || '';
};

const MediaCreate: React.FC<MediaCreateProps> = ({ existingItem }) => {
  const isEditing = !!existingItem;
  const navigate = useNavigate();

  const getInitialTab = (): TabKey => {
    if (existingItem) {
      const validTypes: TabKey[] = ['Article', 'News', 'Guide', 'Video', 'Podcast', 'Event', 'Report', 'Toolkit'];
      if (validTypes.includes(existingItem.type as TabKey)) {
        return existingItem.type as TabKey;
      }
      return 'Article';
    }
    return 'Article';
  };

  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [pendingThumbFile, setPendingThumbFile] = useState<File | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');

  const [podcastFile, setPodcastFile] = useState<File | null>(null);
  const [podcastPreviewUrl, setPodcastPreviewUrl] = useState<string>('');

  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportPreviewName, setReportPreviewName] = useState<string>('');

  const [formData, setFormData] = useState<
    MediaFormData & {
      videoUrl?: string;
      duration?: string;
      podcastUrl?: string;
      episodeNumber?: string;
      eventDate?: string;
      eventLocation?: string;
      eventTime?: string;
      announcementDate?: string;
      downloadUrl?: string;
      fileSize?: string;
    }
  >({
    title: '',
    slug: '',
    summary: '',
    body: '',
    bodyHtml: '',
    bodyJson: null as any,
    type: 'Article',
    language: 'en',
    visibility: 'Public',
    status: 'Draft',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    tags: [],
    // Tab-specific fields
    videoUrl: '',
    duration: '',
    podcastUrl: '',
    episodeNumber: '',
    eventDate: '',
    eventLocation: '',
    eventTime: '',
    announcementDate: '',
    downloadUrl: '',
    fileSize: '',
  });

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [newTag, setNewTag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [canonicalTouched, setCanonicalTouched] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (existingItem) {
      const item = existingItem as any;
      setFormData({
        ...existingItem,
        videoUrl: item.videoUrl || '',
        duration: item.duration || '',
        podcastUrl: item.podcastUrl || '',
        episodeNumber: item.episodeNumber || '',
        eventDate: item.eventDate || '',
        eventLocation: item.eventLocation || '',
        eventTime: item.eventTime || '',
        announcementDate: item.announcementDate || '',
        downloadUrl: item.downloadUrl || '',
        fileSize: item.fileSize || '',
        author: item.author || '',
        source: item.source || '',
        publishedAt: item.publishedAt || '',
        thumbnailUrl: item.thumbnailUrl || '',
      });
    }
  }, [existingItem]);

  // Keep formData.type in sync with activeTab
  useEffect(() => {
    setFormData(prev => ({ ...prev, type: activeTab }));
  }, [activeTab]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setFormData(prev => ({ ...prev, title: value, slug: generateSlug(value) }));
      return;
    }
    if (name === 'slug') setSlugTouched(true);
    if (name === 'canonicalUrl') setCanonicalTouched(true);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectedTags = useMemo(
    () => (Array.isArray(formData.tags) ? formData.tags : []),
    [formData.tags]
  );

  const addAvailableTag = (tag: string) => {
    setAvailableTags(prev => {
      if (prev.includes(tag)) return prev;
      return [...prev, tag].sort((a, b) => a.localeCompare(b));
    });
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    setFormData(prev => {
      const current = Array.isArray(prev.tags) ? prev.tags : [];
      if (current.includes(trimmed)) return prev;
      return { ...prev, tags: [...current, trimmed] };
    });
    addAvailableTag(trimmed);
  };

  const removeTag = (tag: string) => {
    setFormData(prev => {
      const current = Array.isArray(prev.tags) ? prev.tags : [];
      if (!current.includes(tag)) return prev;
      return { ...prev, tags: current.filter(item => item !== tag) };
    });
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => {
      const current = Array.isArray(prev.tags) ? prev.tags : [];
      if (current.includes(tag)) {
        return { ...prev, tags: current.filter(item => item !== tag) };
      }
      return { ...prev, tags: [...current, tag] };
    });
  };

  const createCustomTag = () => {
    if (!newTag.trim()) return;
    addTag(newTag);
    setNewTag('');
  };

  const filteredTags = useMemo(() => {
    if (!tagSearch.trim()) return availableTags;
    const query = tagSearch.toLowerCase();
    return availableTags.filter(tag => tag.toLowerCase().includes(query));
  }, [availableTags, tagSearch]);

  const bodyText = useMemo(
    () => getTextFromHTML(formData.bodyHtml || formData.body || ''),
    [formData.bodyHtml, formData.body]
  );

  const wordCount = useMemo(
    () => (bodyText.trim() ? bodyText.trim().split(/\s+/).length : 0),
    [bodyText]
  );
  const charCount = bodyText.length;

  const slugInvalid = slugTouched && !isValidSlug(formData.slug || '');
  const canonicalInvalid = canonicalTouched && !isValidUrl(formData.canonicalUrl || '');

  const parseDurationToSeconds = (v?: string): number | null => {
    if (!v) return null
    const parts = String(v).split(':').map((n) => parseInt(n, 10))
    if (parts.some((n) => isNaN(n))) return null
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    if (parts.length === 1) return parts[0]
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let slug = (formData.slug || '').trim();
      if (!slug) slug = generateSlug(formData.title || '');

      const editorHtml = DOMPurify.sanitize(formData.bodyHtml || formData.body || '');

      const payload: MediaFormData & { documentUrl?: string } = {
        ...formData,
        slug,
        tags: selectedTags,
        bodyHtml: editorHtml,
        bodyJson: formData.bodyJson as any,
        body: editorHtml,
        // normalize document url field name
        documentUrl: formData.downloadUrl || undefined,
      };

      const newMediaItem = await mediaService.createMediaItem(payload);

      // Post-create uploads to Azure Blob Storage
      try {
        const { uploadFile } = await import('../../lib/storageProvider')
        const typeDir = (formData.type || 'misc').toLowerCase().replace(/[^a-z0-9-]/g, '-')
        // Thumbnail upload and persistence
        if (pendingThumbFile) {
          const { publicUrl, blobPath } = await uploadFile({ file: pendingThumbFile, dir: 'thumbnails', mediaId: newMediaItem.id })
          await mediaService.persistUploadedAsset({
            mediaId: newMediaItem.id,
            kind: 'Image',
            publicUrl,
            storagePath: blobPath,
            mime: pendingThumbFile.type || null,
            sizeBytes: pendingThumbFile.size || null,
          })
        }
        // Video/Podcast/Report uploads and persistence
        if (videoFile) {
          const { publicUrl, blobPath } = await uploadFile({ file: videoFile, dir: 'video', mediaId: newMediaItem.id })
          await mediaService.persistUploadedAsset({
            mediaId: newMediaItem.id,
            kind: 'Video',
            publicUrl,
            storagePath: blobPath,
            mime: videoFile.type || null,
            sizeBytes: videoFile.size || null,
            durationSec: parseDurationToSeconds(formData.duration || '' ) || null,
          })
          // Prioritize uploaded file over external URL
          setFormData((p) => ({ ...p, videoUrl: '' }))
        }
        if (podcastFile) {
          const { publicUrl, blobPath } = await uploadFile({ file: podcastFile, dir: 'podcast', mediaId: newMediaItem.id })
          await mediaService.persistUploadedAsset({
            mediaId: newMediaItem.id,
            kind: podcastFile.type.startsWith('video') ? 'Video' : 'Audio',
            publicUrl,
            storagePath: blobPath,
            mime: podcastFile.type || null,
            sizeBytes: podcastFile.size || null,
            durationSec: parseDurationToSeconds(formData.duration || '' ) || null,
          })
          setFormData((p) => ({ ...p, podcastUrl: '' }))
        }
        if (reportFile) {
          const { publicUrl, blobPath } = await uploadFile({ file: reportFile, dir: 'report', mediaId: newMediaItem.id })
          await mediaService.persistUploadedAsset({
            mediaId: newMediaItem.id,
            kind: 'Doc',
            publicUrl,
            storagePath: blobPath,
            mime: reportFile.type || null,
            sizeBytes: reportFile.size || null,
          })
          setFormData((p) => ({ ...p, downloadUrl: '' }))
        }
      } catch (e) { console.warn('Post-create uploads failed', e) }


      setToast({ message: 'Media item created successfully!', type: 'success' });

      setTimeout(() => {
        navigate(`/admin-ui/media/${newMediaItem.id}`);
      }, 1200);
    } catch (error: any) {
      console.error('Error creating media item', { error, payload: formData });
      setToast({ message: error?.message || 'Failed to create media item', type: 'error' });
      setSubmitting(false);
    }
  };

  const validateStep1 = () => {
    const baseOk =
      Boolean(
        (formData.title || '').trim() &&
          (formData.type || '').trim() &&
          (formData.visibility || '').trim()
      ) &&
      isValidSlug((formData.slug || '').trim() || generateSlug(formData.title || ''));

    if (!baseOk) return false;

    if (activeTab === 'Video') {
      return Boolean(
        ((formData.videoUrl || '').trim() && isValidUrl(formData.videoUrl || '')) || videoFile
      );
    }
    if (activeTab === 'Podcast') {
      return Boolean(
        ((formData.podcastUrl || '').trim() && isValidUrl(formData.podcastUrl || '')) ||
          podcastFile
      );
    }
    if (activeTab === 'Report') {
      return Boolean(
        ((formData.downloadUrl || '').trim() && isValidUrl(formData.downloadUrl || '')) ||
          reportFile
      );
    }
    if (activeTab === 'Guide') {
      return Boolean(
        ((formData.downloadUrl || '').trim() && isValidUrl(formData.downloadUrl || '')) ||
          reportFile
      );
    }
    if (activeTab === 'Toolkit') {
      return Boolean(
        ((formData.downloadUrl || '').trim() && isValidUrl(formData.downloadUrl || '')) ||
          reportFile
      );
    }
    if (activeTab === 'Event') {
      return Boolean((formData.eventDate || '').trim());
    }
    if (activeTab === 'News') {
      return true; // News only requires base fields (title, slug, visibility)
    }
    return true;
  };

  return (
    <AppLayout title="Create New Media Item">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-500 mt-1">Add a new piece of content to your knowledge library</p>
        </div>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* Tab Bar */}
        <div className="sticky top-0 z-20 bg-white/85 backdrop-blur-sm border-b border-gray-200 mb-8" role="tablist">
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                disabled={isEditing && (existingItem?.type as any) !== tab.key}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = index > 0 ? index - 1 : tabs.length - 1;
                    setActiveTab(tabs[prevIndex].key);
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = index < tabs.length - 1 ? index + 1 : 0;
                    setActiveTab(tabs[nextIndex].key);
                  } else if (e.key === 'Home') {
                    e.preventDefault();
                    setActiveTab(tabs[0].key);
                  } else if (e.key === 'End') {
                    e.preventDefault();
                    setActiveTab(tabs[tabs.length - 1].key);
                  }
                }}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-selected={activeTab === tab.key}
                role="tab"
                tabIndex={activeTab === tab.key ? 0 : -1}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="px-4 py-2 text-xs text-gray-500">
            {tabs.find((tab) => tab.key === activeTab)?.description}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Common Fields */}
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
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      slugInvalid ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={slugInvalid}
                    aria-describedby="slug-help"
                    required
                  />
                  <p id="slug-help" className="mt-1 text-sm text-gray-500">
                    URL-friendly identifier. Auto-generated from the title (you can adjust before
                    saving).
                  </p>
                  {slugInvalid && (
                    <p className="mt-1 text-xs text-red-600">
                      Use lowercase letters, numbers, and hyphens only.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div>
                    <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                      Visibility <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="visibility"
                      name="visibility"
                      value={formData.visibility}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                    Summary
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {activeTab === 'Article' && (
                  <div>
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                      Content Body
                    </label>
                    <div className="mt-1">
                      <Suspense
                        fallback={
                          <div className="border rounded-md p-3 text-sm text-gray-500">
                            Loading editor…
                          </div>
                        }
                      >
                        <RichTextEditor
                          valueJson={formData.bodyJson || undefined}
                          valueHtml={formData.bodyHtml || formData.body || ''}
                          onChange={(json, html) =>
                            setFormData((prev) => ({ ...prev, bodyJson: json, bodyHtml: html }))
                          }
                        />
                      </Suspense>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {wordCount} words · {charCount} characters
                    </div>
                  </div>
                )}
              </div>

              {/* Video Tab */}
              {activeTab === 'Video' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
                        Video URL
                      </label>
                      <input
                        id="videoUrl"
                        name="videoUrl"
                        value={formData.videoUrl || ''}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Duration
                      </label>
                      <input
                        id="duration"
                        name="duration"
                        value={formData.duration || ''}
                        onChange={handleChange}
                        placeholder="e.g., 10:30"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Upload Video
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        className="mt-1 text-sm"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setVideoFile(f);
                          setVideoPreviewUrl(f ? URL.createObjectURL(f) : '');
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Provide a URL or upload a file.
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-md p-2 bg-gray-50">
                    <div className="aspect-video bg-black rounded-md overflow-hidden">
                      {isYouTubeUrl(formData.videoUrl || '') ? (
                        <iframe
                          src={getYouTubeEmbedSrc(formData.videoUrl || '')}
                          title="Video preview"
                          className="w-full h-64"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : isVimeoUrl(formData.videoUrl || '') ? (
                        <iframe
                          src={getVimeoEmbedSrc(formData.videoUrl || '')}
                          title="Video preview"
                          className="w-full h-64"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      ) : videoPreviewUrl || (formData.videoUrl && isVideoUrl(formData.videoUrl)) ? (
                        <video
                          src={videoPreviewUrl || (formData.videoUrl as string)}
                          controls
                          className="w-full h-64 bg-black"
                          onLoadedMetadata={(e) => {
                            const d = (e.currentTarget as HTMLVideoElement).duration;
                            if (!formData.duration) {
                              setFormData((prev) => ({ ...prev, duration: formatTime(d) }));
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center text-gray-400">
                          No preview available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Podcast Tab */}
              {activeTab === 'Podcast' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="podcastUrl" className="block text-sm font-medium text-gray-700">
                        Podcast URL
                      </label>
                      <input
                        id="podcastUrl"
                        name="podcastUrl"
                        value={formData.podcastUrl || ''}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://example.com/audio.mp3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="episodeNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Episode Number
                      </label>
                      <input
                        id="episodeNumber"
                        name="episodeNumber"
                        value={formData.episodeNumber || ''}
                        onChange={handleChange}
                        type="number"
                        placeholder="e.g., 42"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Upload Audio/Video
                      </label>
                      <input
                        type="file"
                        accept="audio/*,video/*"
                        className="mt-1 text-sm"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setPodcastFile(f);
                          setPodcastPreviewUrl(f ? URL.createObjectURL(f) : '');
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Provide a URL or upload a file. We auto-detect audio vs video.
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-md p-2 bg-gray-50">
                    <div className="rounded-md overflow-hidden bg-black" style={{ height: '16rem' }}>
                      {podcastPreviewUrl || formData.podcastUrl ? (
                        podcastFile
                          ? podcastFile.type.startsWith('audio')
                            ? (
                              <audio
                                src={podcastPreviewUrl || (formData.podcastUrl as string)}
                                controls
                                className="w-full h-full bg-black"
                                onLoadedMetadata={(e) => {
                                  const d = (e.currentTarget as HTMLAudioElement).duration;
                                  if (!formData.duration) {
                                    setFormData((prev) => ({ ...prev, duration: formatTime(d) }));
                                  }
                                }}
                              />
                            )
                            : (
                              <video
                                src={podcastPreviewUrl || (formData.podcastUrl as string)}
                                controls
                                className="w-full h-full bg-black"
                                onLoadedMetadata={(e) => {
                                  const d = (e.currentTarget as HTMLVideoElement).duration;
                                  if (!formData.duration) {
                                    setFormData((prev) => ({ ...prev, duration: formatTime(d) }));
                                  }
                                }}
                              />
                            )
                          : isAudioUrl(podcastPreviewUrl || (formData.podcastUrl as string))
                            ? (
                              <audio
                                src={podcastPreviewUrl || (formData.podcastUrl as string)}
                                controls
                                className="w-full h-full bg-black"
                                onLoadedMetadata={(e) => {
                                  const d = (e.currentTarget as HTMLAudioElement).duration;
                                  if (!formData.duration) {
                                    setFormData((prev) => ({ ...prev, duration: formatTime(d) }));
                                  }
                                }}
                              />
                            )
                            : (
                              <video
                                src={podcastPreviewUrl || (formData.podcastUrl as string)}
                                controls
                                className="w-full h-full bg-black"
                                onLoadedMetadata={(e) => {
                                  const d = (e.currentTarget as HTMLVideoElement).duration;
                                  if (!formData.duration) {
                                    setFormData((prev) => ({ ...prev, duration: formatTime(d) }));
                                  }
                                }}
                              />
                            )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No preview available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* News Tab */}
              {activeTab === 'News' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                        Source
                      </label>
                      <input
                        id="source"
                        name="source"
                        value={formData.source || ''}
                        onChange={handleChange}
                        placeholder="e.g., Abu Dhabi Times"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="announcementDate" className="block text-sm font-medium text-gray-700">
                        Announcement Date
                      </label>
                      <input
                        id="announcementDate"
                        name="announcementDate"
                        type="date"
                        value={formData.announcementDate || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700">
                        External Link (optional)
                      </label>
                      <input
                        id="canonicalUrl"
                        name="canonicalUrl"
                        type="url"
                        value={formData.canonicalUrl || ''}
                        onChange={handleChange}
                        placeholder="https://example.com/news-article"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Link to external news article if applicable
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Guide Tab */}
              {activeTab === 'Guide' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700">
                        Guide URL
                      </label>
                      <input
                        id="downloadUrl"
                        name="downloadUrl"
                        value={formData.downloadUrl || ''}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://example.com/guide.pdf"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="fileSize" className="block text-sm font-medium text-gray-700">
                        File Size (optional)
                      </label>
                      <input
                        id="fileSize"
                        name="fileSize"
                        value={formData.fileSize || ''}
                        onChange={handleChange}
                        placeholder="e.g., 2.5 MB"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Upload Guide</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="mt-1 text-sm"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setReportFile(f);
                          setReportPreviewName(f ? f.name : '');
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Provide a URL or upload a file. PDF/DOCX supported.
                      </p>
                    </div>
                  </div>

                  {(reportPreviewName || formData.downloadUrl) && (
                    <div className="border rounded-md p-2 bg-gray-50 text-sm text-gray-700">
                      {reportPreviewName && (
                        <div>
                          Selected file: <strong>{reportPreviewName}</strong>
                        </div>
                      )}
                      {formData.downloadUrl && (
                        <div>
                          Link:{' '}
                          <a
                            href={formData.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Open
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Event Tab */}
              {activeTab === 'Event' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        value={formData.eventDate || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">
                        Event Time
                      </label>
                      <input
                        id="eventTime"
                        name="eventTime"
                        type="text"
                        value={formData.eventTime || ''}
                        onChange={handleChange}
                        placeholder="e.g., 9:00 AM - 5:00 PM"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter time range or specific time
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        id="eventLocation"
                        name="eventLocation"
                        value={formData.eventLocation || ''}
                        onChange={handleChange}
                        placeholder="e.g., Abu Dhabi National Exhibition Centre"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="eventLocationDetails" className="block text-sm font-medium text-gray-700">
                        Location Details (optional)
                      </label>
                      <input
                        id="eventLocationDetails"
                        name="eventLocationDetails"
                        value={(formData as any).eventLocationDetails || ''}
                        onChange={handleChange}
                        placeholder="e.g., Hall 5, Gate 3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="eventRegistrationInfo" className="block text-sm font-medium text-gray-700">
                        Registration Information (optional)
                      </label>
                      <textarea
                        id="eventRegistrationInfo"
                        name="eventRegistrationInfo"
                        value={(formData as any).eventRegistrationInfo || ''}
                        onChange={handleChange}
                        rows={3}
                        placeholder="e.g., Free for Abu Dhabi business license holders, AED 500 for others"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700">
                        Registration/Event URL
                      </label>
                      <input
                        id="canonicalUrl"
                        name="canonicalUrl"
                        type="url"
                        value={formData.canonicalUrl || ''}
                        onChange={handleChange}
                        placeholder="https://example.com/register"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Link to registration page or event details
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Report Tab */}
              {activeTab === 'Report' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700">
                        Document URL
                      </label>
                      <input
                        id="downloadUrl"
                        name="downloadUrl"
                        value={formData.downloadUrl || ''}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://example.com/document.pdf"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="fileSize" className="block text-sm font-medium text-gray-700">
                        File Size (optional)
                      </label>
                      <input
                        id="fileSize"
                        name="fileSize"
                        value={formData.fileSize || ''}
                        onChange={handleChange}
                        placeholder="e.g., 2.5 MB"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Upload Document</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        className="mt-1 text-sm"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setReportFile(f);
                          setReportPreviewName(f ? f.name : '');
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Provide a URL or upload a file. PDF/DOCX/PPT supported.
                      </p>
                    </div>
                  </div>

                  {(reportPreviewName || formData.downloadUrl) && (
                    <div className="border rounded-md p-2 bg-gray-50 text-sm text-gray-700">
                      {reportPreviewName && (
                        <div>
                          Selected file: <strong>{reportPreviewName}</strong>
                        </div>
                      )}
                      {formData.downloadUrl && (
                        <div>
                          Link:{' '}
                          <a
                            href={formData.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Open
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Toolkit Tab */}
              {activeTab === 'Toolkit' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700">
                        Template/Tool URL
                      </label>
                      <input
                        id="downloadUrl"
                        name="downloadUrl"
                        value={formData.downloadUrl || ''}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://example.com/template.xlsx"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="fileSize" className="block text-sm font-medium text-gray-700">
                        File Size (optional)
                      </label>
                      <input
                        id="fileSize"
                        name="fileSize"
                        value={formData.fileSize || ''}
                        onChange={handleChange}
                        placeholder="e.g., 1.2 MB"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Upload Template/Tool</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                        className="mt-1 text-sm"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setReportFile(f);
                          setReportPreviewName(f ? f.name : '');
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Provide a URL or upload a file. PDF/DOCX/XLSX/ZIP supported.
                      </p>
                    </div>
                  </div>

                  {(reportPreviewName || formData.downloadUrl) && (
                    <div className="border rounded-md p-2 bg-gray-50 text-sm text-gray-700">
                      {reportPreviewName && (
                        <div>
                          Selected file: <strong>{reportPreviewName}</strong>
                        </div>
                      )}
                      {formData.downloadUrl && (
                        <div>
                          Link:{' '}
                          <a
                            href={formData.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Open
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Card Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Thumbnail</label>
                <p className="text-xs text-gray-500 mb-2">Paste a URL or upload an image. Optional.</p>

                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => {
                      setThumbnailUrl(e.target.value);
                      setPendingThumbFile(null);
                      setThumbnailError(null);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (f) {
                        setPendingThumbFile(f);
                        setThumbnailError(null);
                      }
                    }}
                  />
                </div>

                {(thumbnailUrl || pendingThumbFile) && (
                  <div className="border rounded-md p-2 bg-gray-50">
                    <div className="h-40 w-full overflow-hidden rounded-md bg-white">
                      {pendingThumbFile ? (
                        <img
                          src={URL.createObjectURL(pendingThumbFile)}
                          alt={formData.title || 'Thumbnail preview'}
                          className="h-40 w-full object-cover"
                        />
                      ) : (
                        <img
                          src={thumbnailUrl}
                          alt={formData.title || 'Thumbnail preview'}
                          className="h-40 w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="px-2 py-1 border rounded-md"
                        onClick={() => {
                          setThumbnailUrl('');
                          setPendingThumbFile(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    {thumbnailError && (
                      <div className="mt-2 text-xs text-red-600">{thumbnailError}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Publish Date */}
              <div>
                <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
                  Publish Date
                </label>
                <input
                  id="publishedAt"
                  name="publishedAt"
                  type="datetime-local"
                  value={(formData.publishedAt as string) || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Optional. Leave blank to publish later.</p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <p className="text-xs text-gray-500 mb-2">
                  Select all tags that apply. Tags help the Knowledge Hub filter and surface this media
                  item.
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
                    const isActive = selectedTags.includes(tag);
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
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add custom tag"
                    className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        createCustomTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={createCustomTag}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <PlusCircleIcon className="h-4 w-4" /> Add tag
                  </button>
                </div>
              </div>

              {/* SEO Fields */}
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
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      canonicalInvalid ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional canonical reference for search engines when this content originates
                    elsewhere.
                  </p>
                  {canonicalInvalid && (
                    <p className="mt-1 text-xs text-red-600">Please enter a valid URL (http or https).</p>
                  )}
                </div>
              </div>

              {/* SEO Preview */}
              <div className="border rounded-md p-3 bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">SEO Preview</div>
                <div className="text-blue-700 text-base leading-snug">
                  {(formData.seoTitle || formData.title || 'Page Title') as string}
                </div>
                <div className="text-green-700 text-sm">
                  {(formData.canonicalUrl || 'https://www.example.com/example-path') as string}
                </div>
                <div className="text-gray-700 text-sm mt-1">
                  {(formData.seoDescription || formData.summary || 'Page description preview...') as string}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                  disabled={!validateStep1() || submitting}
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default MediaCreate;
