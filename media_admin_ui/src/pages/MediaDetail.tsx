import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useTenant } from '../context/TenantContext';
import { useAuth, UserRole } from '../context/AuthContext';
import { mediaService, assetService, taxonomyService, submissionService, auditService, MediaItem, Asset, Taxonomy, Submission, AuditLog } from '../utils/supabase';
import { FileIcon, ImageIcon, VideoIcon, FileAudioIcon, TrashIcon, UploadIcon, ClockIcon, CheckIcon, XIcon, AlertCircleIcon, SendIcon, CalendarIcon, EyeIcon, ArchiveIcon, RefreshCwIcon, InfoIcon } from 'lucide-react';
type Tab = 'details' | 'assets' | 'taxonomy' | 'schedule' | 'actions' | 'audit';
const MediaDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    currentTenant
  } = useTenant();
  const {
    user,
    hasPermission
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([]);
  const [mediaTaxonomies, setMediaTaxonomies] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<MediaItem>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  // Schedule data
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');
  useEffect(() => {
    if (!id || !currentTenant) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch media item
        const media = await mediaService.getMediaItemById(id, currentTenant.id);
        setMediaItem(media);
        setFormData(media);
        if (media.publishedAt) {
          const date = new Date(media.publishedAt);
          setScheduleDate(date.toISOString().split('T')[0]);
          setScheduleTime(date.toTimeString().slice(0, 5));
        }
        // Fetch assets
        const mediaAssets = await assetService.getAssetsByMediaId(id, currentTenant.id);
        setAssets(mediaAssets);
        // Fetch taxonomies
        const allTaxonomies = await taxonomyService.getTaxonomies(currentTenant.id);
        setTaxonomies(allTaxonomies);
        // Fetch media taxonomies
        const mediaTaxIds = await taxonomyService.getMediaTaxonomies(id, currentTenant.id);
        setMediaTaxonomies(mediaTaxIds);
        // Fetch submissions
        const mediaSubmissions = await submissionService.getSubmissionsByMediaId(id, currentTenant.id);
        setSubmissions(mediaSubmissions);
        // Fetch audit logs
        const logs = await auditService.getAuditLogs(id, currentTenant.id);
        setAuditLogs(logs);
      } catch (error) {
        console.error('Error fetching media data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, currentTenant]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSave = async () => {
    if (!id || !currentTenant || !mediaItem) return;
    setSaving(true);
    try {
      const updatedMedia = await mediaService.updateMediaItem(id, {
        ...formData,
        tenantId: currentTenant.id
      });
      setMediaItem(updatedMedia);
      setEditMode(false);
      // Add audit log
      await auditService.createAuditLog({
        tenantId: currentTenant.id,
        action: 'updated',
        actorId: user?.id || 'system',
        entity: 'media',
        entityId: id,
        diff: {
          before: mediaItem,
          after: updatedMedia
        }
      });
    } catch (error) {
      console.error('Error updating media item:', error);
      alert('Failed to update media item. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !id || !currentTenant) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      // Upload file to Supabase Storage
      const newAsset = await assetService.uploadAsset(file, id, currentTenant.id);
      // Add to assets list
      setAssets(prev => [...prev, newAsset]);
      // Clear input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteAsset = async (assetId: string) => {
    if (!currentTenant) return;
    if (confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetService.deleteAsset(assetId, currentTenant.id);
        setAssets(prev => prev.filter(asset => asset.id !== assetId));
      } catch (error) {
        console.error('Error deleting asset:', error);
        alert('Failed to delete asset. Please try again.');
      }
    }
  };
  const handleTaxonomyToggle = async (taxonomyId: string) => {
    if (!id || !currentTenant) return;
    try {
      if (mediaTaxonomies.includes(taxonomyId)) {
        // Remove taxonomy
        await taxonomyService.removeTaxonomy(id, taxonomyId, currentTenant.id);
        setMediaTaxonomies(prev => prev.filter(id => id !== taxonomyId));
      } else {
        // Add taxonomy
        await taxonomyService.assignTaxonomy(id, taxonomyId, currentTenant.id);
        setMediaTaxonomies(prev => [...prev, taxonomyId]);
      }
    } catch (error) {
      console.error('Error toggling taxonomy:', error);
      alert('Failed to update taxonomies. Please try again.');
    }
  };
  const handleSchedule = async () => {
    if (!id || !currentTenant || !mediaItem) return;
    // Validate date and time
    if (!scheduleDate) {
      alert('Please select a date');
      return;
    }
    // Combine date and time
    const publishDate = scheduleTime ? new Date(`${scheduleDate}T${scheduleTime}:00`) : new Date(`${scheduleDate}T00:00:00`);
    // Validate not in past
    if (publishDate < new Date()) {
      alert('Scheduled time cannot be in the past');
      return;
    }
    setSaving(true);
    try {
      const updatedMedia = await mediaService.updateMediaItem(id, {
        ...mediaItem,
        publishedAt: publishDate.toISOString(),
        status: 'Scheduled'
      });
      setMediaItem(updatedMedia);
      // Add audit log
      await auditService.createAuditLog({
        tenantId: currentTenant.id,
        action: 'scheduled',
        actorId: user?.id || 'system',
        entity: 'media',
        entityId: id,
        diff: {
          before: {
            status: mediaItem.status,
            publishedAt: mediaItem.publishedAt
          },
          after: {
            status: 'Scheduled',
            publishedAt: publishDate.toISOString()
          }
        }
      });
      alert('Media item scheduled successfully');
    } catch (error) {
      console.error('Error scheduling media item:', error);
      alert('Failed to schedule media item. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  const handleSubmitForReview = async () => {
    if (!id || !currentTenant || !mediaItem) return;
    if (confirm('Submit this media item for review?')) {
      setSaving(true);
      try {
        // Create submission
        await submissionService.createSubmission(id, currentTenant.id);
        // Update media status
        const updatedMedia = await mediaService.updateMediaItem(id, {
          ...mediaItem,
          status: 'InReview'
        });
        setMediaItem(updatedMedia);
        // Add audit log
        await auditService.createAuditLog({
          tenantId: currentTenant.id,
          action: 'submitted',
          actorId: user?.id || 'system',
          entity: 'media',
          entityId: id,
          diff: {
            before: {
              status: mediaItem.status
            },
            after: {
              status: 'InReview'
            }
          }
        });
        // Refresh submissions
        const mediaSubmissions = await submissionService.getSubmissionsByMediaId(id, currentTenant.id);
        setSubmissions(mediaSubmissions);
        alert('Media item submitted for review');
      } catch (error) {
        console.error('Error submitting for review:', error);
        alert('Failed to submit for review. Please try again.');
      } finally {
        setSaving(false);
      }
    }
  };
  const handleApproveReject = async (approved: boolean) => {
    if (!id || !currentTenant || !mediaItem || !user) return;
    const action = approved ? 'approve' : 'reject';
    const confirmMessage = approved ? 'Approve this media item?' : 'Reject this media item? This will send it back to draft status.';
    if (confirm(confirmMessage)) {
      setSaving(true);
      try {
        // Find latest submission
        const latestSubmission = submissions[0];
        if (!latestSubmission) {
          throw new Error('No submission found');
        }
        // Update submission
        await submissionService.updateSubmission(latestSubmission.id, approved ? 'Approved' : 'Rejected', user.id, currentTenant.id);
        // Update media status
        const updatedMedia = await mediaService.updateMediaItem(id, {
          ...mediaItem,
          status: approved ? 'Scheduled' : 'Draft'
        });
        setMediaItem(updatedMedia);
        // Add audit log
        await auditService.createAuditLog({
          tenantId: currentTenant.id,
          action: approved ? 'approved' : 'rejected',
          actorId: user.id,
          entity: 'media',
          entityId: id,
          diff: {
            before: {
              status: mediaItem.status
            },
            after: {
              status: approved ? 'Scheduled' : 'Draft'
            }
          }
        });
        // Refresh submissions
        const mediaSubmissions = await submissionService.getSubmissionsByMediaId(id, currentTenant.id);
        setSubmissions(mediaSubmissions);
        alert(`Media item ${approved ? 'approved' : 'rejected'}`);
      } catch (error) {
        console.error(`Error ${action}ing media item:`, error);
        alert(`Failed to ${action} media item. Please try again.`);
      } finally {
        setSaving(false);
      }
    }
  };
  const handlePublishUnpublish = async (publish: boolean) => {
    if (!id || !currentTenant || !mediaItem) return;
    const action = publish ? 'publish' : 'unpublish';
    const confirmMessage = publish ? 'Publish this media item now?' : 'Unpublish this media item?';
    if (confirm(confirmMessage)) {
      setSaving(true);
      try {
        // Update media status
        const updatedMedia = await mediaService.updateMediaItem(id, {
          ...mediaItem,
          status: publish ? 'Published' : 'Draft',
          publishedAt: publish ? new Date().toISOString() : null
        });
        setMediaItem(updatedMedia);
        // Add audit log
        await auditService.createAuditLog({
          tenantId: currentTenant.id,
          action: publish ? 'published' : 'unpublished',
          actorId: user?.id || 'system',
          entity: 'media',
          entityId: id,
          diff: {
            before: {
              status: mediaItem.status,
              publishedAt: mediaItem.publishedAt
            },
            after: {
              status: publish ? 'Published' : 'Draft',
              publishedAt: publish ? new Date().toISOString() : null
            }
          }
        });
        // In a real app, this would trigger the webhook to Knowledge Hub
        console.log(`Webhook to Knowledge Hub: Media item ${action}ed - ${id}`);
        alert(`Media item ${action}ed successfully`);
      } catch (error) {
        console.error(`Error ${action}ing media item:`, error);
        alert(`Failed to ${action} media item. Please try again.`);
      } finally {
        setSaving(false);
      }
    }
  };
  const handleArchive = async () => {
    if (!id || !currentTenant || !mediaItem) return;
    if (confirm('Archive this media item? This will remove it from public view.')) {
      setSaving(true);
      try {
        // Update media status
        const updatedMedia = await mediaService.updateMediaItem(id, {
          ...mediaItem,
          status: 'Archived'
        });
        setMediaItem(updatedMedia);
        // Add audit log
        await auditService.createAuditLog({
          tenantId: currentTenant.id,
          action: 'archived',
          actorId: user?.id || 'system',
          entity: 'media',
          entityId: id,
          diff: {
            before: {
              status: mediaItem.status
            },
            after: {
              status: 'Archived'
            }
          }
        });
        alert('Media item archived successfully');
      } catch (error) {
        console.error('Error archiving media item:', error);
        alert('Failed to archive media item. Please try again.');
      } finally {
        setSaving(false);
      }
    }
  };
  // Role-based permission checks
  const canEdit = hasPermission(['Admin', 'Editor', 'Provider']) && mediaItem?.status !== 'InReview' && mediaItem?.status !== 'Archived';
  const canSubmitForReview = hasPermission(['Admin', 'Editor']) && mediaItem?.status === 'Draft';
  const canApproveReject = hasPermission(['Admin', 'Reviewer']) && mediaItem?.status === 'InReview';
  const canPublishUnpublish = (hasPermission(['Admin', 'Reviewer']) || hasPermission(['Editor']) && submissions.some(s => s.state === 'Approved')) && (mediaItem?.status === 'Scheduled' || mediaItem?.status === 'Draft' || mediaItem?.status === 'Published');
  const canArchive = hasPermission(['Admin']) && mediaItem?.status !== 'Archived';
  if (loading) {
    return <AppLayout title="Media Detail">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AppLayout>;
  }
  if (!mediaItem) {
    return <AppLayout title="Media Detail">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Media Item Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested media item could not be found or you don't have
            permission to view it.
          </p>
          <button onClick={() => navigate('/media')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Back to Media Library
          </button>
        </div>
      </AppLayout>;
  }
  return <AppLayout title={mediaItem.title}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {mediaItem.title}
            </h2>
            <span className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${mediaItem.status === 'Draft' ? 'bg-gray-100 text-gray-800' : mediaItem.status === 'InReview' ? 'bg-yellow-100 text-yellow-800' : mediaItem.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' : mediaItem.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {mediaItem.status}
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Last updated: {new Date(mediaItem.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          {canEdit && !editMode && <button onClick={() => setEditMode(true)} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md">
              Edit
            </button>}
          <button onClick={() => navigate('/media')} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md">
            Back to Library
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('details')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Details
            </button>
            <button onClick={() => setActiveTab('assets')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'assets' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Assets
            </button>
            <button onClick={() => setActiveTab('taxonomy')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'taxonomy' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Taxonomy
            </button>
            <button onClick={() => setActiveTab('schedule')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'schedule' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Schedule
            </button>
            <button onClick={() => setActiveTab('actions')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'actions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Actions
            </button>
            <button onClick={() => setActiveTab('audit')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'audit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Audit
            </button>
          </nav>
        </div>
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && <div>
              {editMode ? <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="Article">Article</option>
                        <option value="Report">Report</option>
                        <option value="Announcement">Announcement</option>
                        <option value="Event">Event</option>
                        <option value="Podcast">Podcast</option>
                        <option value="Video">Video</option>
                        <option value="Image">Image</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        Language <span className="text-red-500">*</span>
                      </label>
                      <select id="language" name="language" value={formData.language} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                      Visibility <span className="text-red-500">*</span>
                    </label>
                    <select id="visibility" name="visibility" value={formData.visibility} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                      Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required></textarea>
                  </div>
                  <div>
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                      Content Body
                    </label>
                    <textarea id="body" name="body" value={formData.body} onChange={handleChange} rows={10} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                  </div>
                  <div>
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                      SEO Title
                    </label>
                    <input type="text" id="seoTitle" name="seoTitle" value={formData.seoTitle || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
                      SEO Description
                    </label>
                    <textarea id="seoDescription" name="seoDescription" value={formData.seoDescription || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                  </div>
                  <div>
                    <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700">
                      Canonical URL
                    </label>
                    <input type="url" id="canonicalUrl" name="canonicalUrl" value={formData.canonicalUrl || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => {
                setFormData(mediaItem);
                setEditMode(false);
              }} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50" disabled={saving}>
                      Cancel
                    </button>
                    <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div> : <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Type
                      </h3>
                      <p className="mt-1">{mediaItem.type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Language
                      </h3>
                      <p className="mt-1">{mediaItem.language}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Visibility
                      </h3>
                      <p className="mt-1">{mediaItem.visibility}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      URL Slug
                    </h3>
                    <p className="mt-1">{mediaItem.slug}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Summary
                    </h3>
                    <p className="mt-1 text-gray-800">{mediaItem.summary}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Content Body
                    </h3>
                    <div className="mt-1 prose max-w-none" dangerouslySetInnerHTML={{
                __html: mediaItem.body || '<p>No content</p>'
              }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        SEO Title
                      </h3>
                      <p className="mt-1">
                        {mediaItem.seoTitle || '(Not set)'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        SEO Description
                      </h3>
                      <p className="mt-1">
                        {mediaItem.seoDescription || '(Not set)'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Canonical URL
                    </h3>
                    <p className="mt-1">
                      {mediaItem.canonicalUrl ? <a href={mediaItem.canonicalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {mediaItem.canonicalUrl}
                        </a> : '(Not set)'}
                    </p>
                  </div>
                </div>}
            </div>}
          {/* Assets Tab */}
          {activeTab === 'assets' && <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Media Assets
                </h3>
                {canEdit && <div>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer flex items-center">
                      <UploadIcon className="w-5 h-5 mr-2" />
                      Upload Asset
                      <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>}
              </div>
              {uploading && <div className="mb-4 p-4 bg-blue-50 rounded-md flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                  <p className="text-blue-700">Uploading asset...</p>
                </div>}
              {assets.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-md">
                  <FileIcon className="w-12 h-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No assets
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by uploading a file.
                  </p>
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assets.map(asset => <div key={asset.id} className="border rounded-md overflow-hidden">
                      <div className="h-48 bg-gray-100 relative">
                        {asset.kind === 'Image' ? <img src={asset.publicUrl} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full">
                            {asset.kind === 'Video' && <VideoIcon className="w-16 h-16 text-gray-400" />}
                            {asset.kind === 'Audio' && <FileAudioIcon className="w-16 h-16 text-gray-400" />}
                            {asset.kind === 'Doc' && <FileIcon className="w-16 h-16 text-gray-400" />}
                          </div>}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {asset.storagePath.split('/').pop()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          {canEdit && <button onClick={() => handleDeleteAsset(asset.id)} className="text-red-600 hover:text-red-800" title="Delete asset">
                              <TrashIcon className="w-5 h-5" />
                            </button>}
                        </div>
                        <div className="mt-2 flex justify-between">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {asset.mime}
                          </span>
                          <a href={asset.publicUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                            View
                          </a>
                        </div>
                      </div>
                    </div>)}
                </div>}
            </div>}
          {/* Taxonomy Tab */}
          {activeTab === 'taxonomy' && <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Taxonomy
              </h3>
              {canEdit ? <div className="space-y-8">
                  {['Domain', 'Stage', 'Format', 'Tag'].map(kind => <div key={kind}>
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        {kind}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {taxonomies.filter(tax => tax.kind === kind).map(taxonomy => <button key={taxonomy.id} onClick={() => handleTaxonomyToggle(taxonomy.id)} className={`px-3 py-1 rounded-full text-sm ${mediaTaxonomies.includes(taxonomy.id) ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}>
                              {taxonomy.label}
                            </button>)}
                      </div>
                    </div>)}
                </div> : <div className="space-y-8">
                  {['Domain', 'Stage', 'Format', 'Tag'].map(kind => {
              const kindTaxonomies = taxonomies.filter(tax => tax.kind === kind && mediaTaxonomies.includes(tax.id));
              return <div key={kind}>
                        <h4 className="text-md font-medium text-gray-700 mb-2">
                          {kind}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {kindTaxonomies.length === 0 ? <p className="text-gray-500 text-sm">
                              No {kind.toLowerCase()} assigned
                            </p> : kindTaxonomies.map(taxonomy => <span key={taxonomy.id} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 border border-gray-200">
                                {taxonomy.label}
                              </span>)}
                        </div>
                      </div>;
            })}
                </div>}
            </div>}
          {/* Schedule Tab */}
          {activeTab === 'schedule' && <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Schedule Publication
              </h3>
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex items-center">
                  <InfoIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <p className="text-sm text-gray-700">
                    {mediaItem.status === 'Published' ? 'This item is currently published.' : mediaItem.status === 'Scheduled' ? 'This item is scheduled for publication.' : 'Set a date and time to schedule this item for publication.'}
                  </p>
                </div>
              </div>
              {canEdit || canPublishUnpublish ? <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">
                        Publication Date
                      </label>
                      <input type="date" id="scheduleDate" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700">
                        Publication Time (optional)
                      </label>
                      <input type="time" id="scheduleTime" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                  {scheduleDate && <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="text-sm font-medium text-blue-800">
                        Preview
                      </h4>
                      <p className="mt-1 text-sm text-blue-700">
                        This item will be published on{' '}
                        <span className="font-medium">
                          {new Date(`${scheduleDate}T${scheduleTime || '00:00'}:00`).toLocaleString()}
                        </span>
                      </p>
                    </div>}
                  <div className="flex justify-end">
                    <button onClick={handleSchedule} disabled={!scheduleDate || saving} className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${!scheduleDate || saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      {saving ? 'Scheduling...' : 'Schedule Publication'}
                    </button>
                  </div>
                </div> : <div className="text-center py-6">
                  <p className="text-gray-500">
                    You don't have permission to schedule this item.
                  </p>
                </div>}
              {mediaItem.publishedAt && <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700">
                    Current Schedule
                  </h4>
                  <p className="mt-1">
                    {mediaItem.status === 'Published' ? `Published on ${new Date(mediaItem.publishedAt).toLocaleString()}` : mediaItem.status === 'Scheduled' ? `Scheduled for ${new Date(mediaItem.publishedAt).toLocaleString()}` : `Last published on ${new Date(mediaItem.publishedAt).toLocaleString()}`}
                  </p>
                </div>}
            </div>}
          {/* Actions Tab */}
          {activeTab === 'actions' && <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Actions
              </h3>
              <div className="space-y-6">
                {/* Submit for Review */}
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <SendIcon className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900">
                        Submit for Review
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Send this media item to reviewers for approval before
                        publishing.
                      </p>
                      <div className="mt-2">
                        <button onClick={handleSubmitForReview} disabled={!canSubmitForReview || saving} className={`px-3 py-1 text-sm rounded-md ${canSubmitForReview && !saving ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}>
                          {saving ? 'Submitting...' : 'Submit for Review'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Approve/Reject */}
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircleIcon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900">
                        Review
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Approve or reject this media item for publication.
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <button onClick={() => handleApproveReject(true)} disabled={!canApproveReject || saving} className={`px-3 py-1 text-sm rounded-md ${canApproveReject && !saving ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}>
                          <CheckIcon className="w-4 h-4 inline mr-1" />
                          {saving ? 'Processing...' : 'Approve'}
                        </button>
                        <button onClick={() => handleApproveReject(false)} disabled={!canApproveReject || saving} className={`px-3 py-1 text-sm rounded-md ${canApproveReject && !saving ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}>
                          <XIcon className="w-4 h-4 inline mr-1" />
                          {saving ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Publish/Unpublish */}
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <EyeIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900">
                        Publish
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {mediaItem.status === 'Published' ? 'This item is currently published. You can unpublish it to remove it from public view.' : 'Make this item available to users immediately.'}
                      </p>
                      <div className="mt-2">
                        {mediaItem.status === 'Published' ? <button onClick={() => handlePublishUnpublish(false)} disabled={!canPublishUnpublish || saving} className={`px-3 py-1 text-sm rounded-md ${canPublishUnpublish && !saving ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}>
                            {saving ? 'Processing...' : 'Unpublish'}
                          </button> : <button onClick={() => handlePublishUnpublish(true)} disabled={!canPublishUnpublish || saving} className={`px-3 py-1 text-sm rounded-md ${canPublishUnpublish && !saving ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}>
                            {saving ? 'Processing...' : 'Publish Now'}
                          </button>}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Archive */}
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ArchiveIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900">
                        Archive
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Move this item to the archive. It will no longer be
                        visible to users.
                      </p>
                      <div className="mt-2">
                        <button onClick={handleArchive} disabled={!canArchive || saving} className={`px-3 py-1 text-sm rounded-md ${canArchive && !saving ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}>
                          {saving ? 'Processing...' : 'Archive Item'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {/* Audit Tab */}
          {activeTab === 'audit' && <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Audit Log
              </h3>
              {auditLogs.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-md">
                  <RefreshCwIcon className="w-12 h-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No audit logs
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No changes have been recorded yet.
                  </p>
                </div> : <div className="flow-root">
                  <ul className="-mb-8">
                    {auditLogs.map((log, index) => <li key={log.id}>
                        <div className="relative pb-8">
                          {index !== auditLogs.length - 1 && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${log.action === 'created' ? 'bg-green-500' : log.action === 'updated' ? 'bg-blue-500' : log.action === 'submitted' ? 'bg-yellow-500' : log.action === 'approved' ? 'bg-purple-500' : log.action === 'rejected' ? 'bg-red-500' : log.action === 'published' ? 'bg-green-500' : log.action === 'unpublished' ? 'bg-orange-500' : log.action === 'archived' ? 'bg-gray-500' : 'bg-gray-500'}`}>
                                <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {log.action === 'created' && 'Created the media item'}
                                  {log.action === 'updated' && 'Updated the media item'}
                                  {log.action === 'submitted' && 'Submitted for review'}
                                  {log.action === 'approved' && 'Approved the media item'}
                                  {log.action === 'rejected' && 'Rejected the media item'}
                                  {log.action === 'published' && 'Published the media item'}
                                  {log.action === 'unpublished' && 'Unpublished the media item'}
                                  {log.action === 'archived' && 'Archived the media item'}
                                  {log.action === 'scheduled' && 'Scheduled the media item'}
                                </p>
                                {log.diff && <div className="mt-2 text-sm">
                                    <div className="font-medium text-gray-900">
                                      Changes:
                                    </div>
                                    <ul className="mt-1 list-disc list-inside text-gray-500">
                                      {log.diff.before && log.diff.after && Object.keys(log.diff.after).map(key => {
                              if (JSON.stringify(log.diff.before[key]) !== JSON.stringify(log.diff.after[key])) {
                                return <li key={key}>
                                                  <span className="font-medium">
                                                    {key}
                                                  </span>
                                                  :{' '}
                                                  <span className="line-through text-red-500">
                                                    {JSON.stringify(log.diff.before[key])}
                                                  </span>{' '}
                                                  <span className="text-green-500">
                                                    {JSON.stringify(log.diff.after[key])}
                                                  </span>
                                                </li>;
                              }
                              return null;
                            })}
                                    </ul>
                                  </div>}
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={log.at}>
                                  {new Date(log.at).toLocaleString()}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>)}
                  </ul>
                </div>}
            </div>}
        </div>
      </div>
    </AppLayout>;
};
export default MediaDetail;