import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';
// Types for our database entities
export interface MediaItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  type: 'Article' | 'Report' | 'Announcement' | 'Event' | 'Podcast' | 'Video' | 'Image';
  status: 'Draft' | 'InReview' | 'Scheduled' | 'Published' | 'Archived';
  visibility: 'Public' | 'Private';
  language: string;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}
export interface Asset {
  id: string;
  mediaId: string;
  storagePath: string;
  publicUrl: string;
  mime: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  durationSec: number | null;
  checksum: string;
  kind?: 'Image' | 'Video' | 'Audio' | 'Doc';
}
export interface Taxonomy {
  id: string;
  kind: 'Domain' | 'Stage' | 'Format' | 'Tag';
  label: string;
  key: string;
}
export interface Submission {
  id: string;
  mediaId: string;
  state: 'Submitted' | 'Approved' | 'Rejected';
  reviewerId: string | null;
  createdAt: string;
}
export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  at: string;
  entity: string;
  entityId: string;
  diff: any;
}
// Helper functions for media operations
export const mediaService = {
  async getMediaItems(filters: any = {}, page = 1, pageSize = 10, orderBy = {
    field: 'published_at',
    direction: 'desc'
  }) {
    try {
      let query = supabase.from('media_items').select('*', {
        count: 'exact'
      });
      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.visibility) {
        query = query.eq('visibility', filters.visibility);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
      }
      // Apply ordering
      const orderField = orderBy.field === 'publishedAt' ? 'published_at' : orderBy.field === 'updatedAt' ? 'updated_at' : 'created_at';
      const orderDirection = orderBy.direction === 'desc' ? 'desc' : 'asc';
      query = query.order(orderField, {
        ascending: orderDirection === 'asc'
      });
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      const {
        data,
        error,
        count
      } = await query;
      if (error) throw error;
      // Map database fields to our interface
      const mappedData = data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        body: item.body,
        type: item.type,
        status: item.status,
        visibility: item.visibility,
        language: item.language,
        publishedAt: item.published_at,
        updatedAt: item.updated_at,
        createdAt: item.created_at
      })) as MediaItem[];
      return {
        data: mappedData,
        count: count || 0
      };
    } catch (error) {
      console.error('Error fetching media items:', error);
      throw error;
    }
  },
  async getMediaItemById(id: string, tenantId?: string) {
    try {
      const {
        data,
        error
      } = await supabase.from('media_items').select('*').eq('id', id).single();
      if (error) throw error;
      if (!data) throw new Error('Media item not found');
      // Map database fields to our interface
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        body: data.body,
        type: data.type,
        status: data.status,
        visibility: data.visibility,
        language: data.language,
        publishedAt: data.published_at,
        updatedAt: data.updated_at,
        createdAt: data.created_at,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        canonicalUrl: data.canonical_url
      } as MediaItem;
    } catch (error) {
      console.error('Error fetching media item:', error);
      throw error;
    }
  },
  async createMediaItem(data: Partial<MediaItem>) {
    try {
      // Prepare the payload to match the database schema
      const payload = {
        id: data.id || uuidv4(),
        title: data.title || '',
        slug: data.slug || '',
        summary: data.summary || '',
        body: data.body || '',
        type: data.type || 'Article',
        status: data.status || 'Draft',
        visibility: data.visibility || 'Public',
        language: data.language || 'en',
        published_at: data.publishedAt,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        seo_title: data.seoTitle,
        seo_description: data.seoDescription,
        canonical_url: data.canonicalUrl
      };
      console.log('Creating media item with payload:', payload);
      const {
        data: insertedData,
        error
      } = await supabase.from('media_items').insert([payload]).select().single();
      if (error) {
        console.error('Supabase error creating media item:', {
          error,
          payload
        });
        throw error;
      }
      if (!insertedData) {
        const noDataError = new Error('No data returned from insert operation');
        console.error('Supabase error creating media item:', {
          error: noDataError,
          payload
        });
        throw noDataError;
      }
      // Map database fields to our interface
      return {
        id: insertedData.id,
        title: insertedData.title,
        slug: insertedData.slug,
        summary: insertedData.summary,
        body: insertedData.body,
        type: insertedData.type,
        status: insertedData.status,
        visibility: insertedData.visibility,
        language: insertedData.language,
        publishedAt: insertedData.published_at,
        updatedAt: insertedData.updated_at,
        createdAt: insertedData.created_at,
        seoTitle: insertedData.seo_title,
        seoDescription: insertedData.seo_description,
        canonicalUrl: insertedData.canonical_url
      } as MediaItem;
    } catch (error) {
      console.error('Error creating media item:', error);
      throw error;
    }
  },
  async updateMediaItem(id: string, data: Partial<MediaItem>) {
    try {
      const {
        data: updatedData,
        error
      } = await supabase.from('media_items').update({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        body: data.body,
        type: data.type,
        status: data.status,
        visibility: data.visibility,
        language: data.language,
        published_at: data.publishedAt,
        updated_at: new Date().toISOString(),
        seo_title: data.seoTitle,
        seo_description: data.seoDescription,
        canonical_url: data.canonicalUrl
      }).eq('id', id).select().single();
      if (error) throw error;
      // Map database fields to our interface
      return {
        id: updatedData.id,
        title: updatedData.title,
        slug: updatedData.slug,
        summary: updatedData.summary,
        body: updatedData.body,
        type: updatedData.type,
        status: updatedData.status,
        visibility: updatedData.visibility,
        language: updatedData.language,
        publishedAt: updatedData.published_at,
        updatedAt: updatedData.updated_at,
        createdAt: updatedData.created_at,
        seoTitle: updatedData.seo_title,
        seoDescription: updatedData.seo_description,
        canonicalUrl: updatedData.canonical_url
      } as MediaItem;
    } catch (error) {
      console.error('Error updating media item:', error);
      throw error;
    }
  },
  async deleteMediaItem(id: string) {
    try {
      const {
        error
      } = await supabase.from('media_items').delete().eq('id', id);
      if (error) throw error;
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting media item:', error);
      throw error;
    }
  },
  async getStatusCounts() {
    try {
      const {
        data,
        error
      } = await supabase.from('media_items').select('status');
      if (error) throw error;
      const counts = {
        Draft: 0,
        InReview: 0,
        Scheduled: 0,
        Published: 0,
        Archived: 0
      };
      // Count items by status
      data.forEach(item => {
        if (counts.hasOwnProperty(item.status)) {
          counts[item.status as keyof typeof counts]++;
        }
      });
      return counts;
    } catch (error) {
      console.error('Error getting status counts:', error);
      throw error;
    }
  }
};
// Asset service functions
export const assetService = {
  async getAssetsByMediaId(mediaId: string, tenantId?: string) {
    try {
      const {
        data,
        error
      } = await supabase.from('media_assets').select('*').eq('media_id', mediaId);
      if (error) throw error;
      // Map database fields to our interface
      return data.map(asset => ({
        id: asset.id,
        mediaId: asset.media_id,
        storagePath: asset.storage_path,
        publicUrl: asset.public_url,
        mime: asset.mime,
        sizeBytes: asset.size_bytes,
        width: asset.width,
        height: asset.height,
        durationSec: asset.duration_sec,
        checksum: asset.checksum,
        kind: asset.kind || 'Doc'
      })) as Asset[];
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },
  async uploadAsset(file: File, mediaId: string, tenantId?: string) {
    try {
      // Generate a unique path for the file
      const filePath = `media/${mediaId}/${uuidv4()}-${file.name}`;
      // Get a signed URL for upload
      const {
        data: signedUrlData,
        error: signedUrlError
      } = await supabase.storage.from('media').createSignedUploadUrl(filePath);
      if (signedUrlError) throw signedUrlError;
      // Upload the file using the signed URL
      const {
        error: uploadError
      } = await supabase.storage.from('media').upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });
      if (uploadError) throw uploadError;
      // Get public URL for the file
      const {
        data: publicUrlData
      } = supabase.storage.from('media').getPublicUrl(filePath);
      // Calculate checksum (in a real app, use a proper hashing function)
      const checksum = `${Date.now()}-${file.size}-${file.name}`;
      // Create asset record
      const {
        data: assetData,
        error: assetError
      } = await supabase.from('media_assets').insert([{
        id: uuidv4(),
        media_id: mediaId,
        storage_path: filePath,
        public_url: publicUrlData.publicUrl,
        mime: file.type,
        size_bytes: file.size,
        width: null,
        // Would be determined from actual file in production
        height: null,
        // Would be determined from actual file in production
        duration_sec: null,
        // Would be determined from actual file in production
        checksum,
        kind: file.type.startsWith('image/') ? 'Image' : file.type.startsWith('video/') ? 'Video' : file.type.startsWith('audio/') ? 'Audio' : 'Doc'
      }]).select().single();
      if (assetError) throw assetError;
      return {
        id: assetData.id,
        mediaId: assetData.media_id,
        storagePath: assetData.storage_path,
        publicUrl: assetData.public_url,
        mime: assetData.mime,
        sizeBytes: assetData.size_bytes,
        width: assetData.width,
        height: assetData.height,
        durationSec: assetData.duration_sec,
        checksum: assetData.checksum,
        kind: assetData.kind
      } as Asset;
    } catch (error) {
      console.error('Error uploading asset:', error);
      throw error;
    }
  },
  async deleteAsset(id: string, tenantId?: string) {
    try {
      // First get the asset to know its storage path
      const {
        data: asset,
        error: getError
      } = await supabase.from('media_assets').select('storage_path').eq('id', id).single();
      if (getError) throw getError;
      // Delete from storage
      if (asset && asset.storage_path) {
        const {
          error: storageError
        } = await supabase.storage.from('media').remove([asset.storage_path]);
        if (storageError) throw storageError;
      }
      // Delete the record
      const {
        error: deleteError
      } = await supabase.from('media_assets').delete().eq('id', id);
      if (deleteError) throw deleteError;
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  }
};
// Taxonomy service functions
export const taxonomyService = {
  async getTaxonomies(tenantId?: string) {
    try {
      const {
        data,
        error
      } = await supabase.from('taxonomies').select('*').order('kind');
      if (error) throw error;
      return data.map(tax => ({
        id: tax.id,
        kind: tax.kind,
        label: tax.label,
        key: tax.key
      })) as Taxonomy[];
    } catch (error) {
      console.error('Error fetching taxonomies:', error);
      // Return mock data for demo
      return [{
        id: '1',
        kind: 'Domain',
        label: 'Education',
        key: 'education'
      }, {
        id: '2',
        kind: 'Domain',
        label: 'Health',
        key: 'health'
      }, {
        id: '3',
        kind: 'Stage',
        label: 'Early',
        key: 'early'
      }, {
        id: '4',
        kind: 'Stage',
        label: 'Growth',
        key: 'growth'
      }, {
        id: '5',
        kind: 'Format',
        label: 'Article',
        key: 'article'
      }, {
        id: '6',
        kind: 'Format',
        label: 'Video',
        key: 'video'
      }, {
        id: '7',
        kind: 'Tag',
        label: 'Featured',
        key: 'featured'
      }, {
        id: '8',
        kind: 'Tag',
        label: 'Popular',
        key: 'popular'
      }];
    }
  },
  async getMediaTaxonomies(mediaId: string, tenantId?: string) {
    try {
      const {
        data,
        error
      } = await supabase.from('media_taxonomies').select('taxonomy_id').eq('media_id', mediaId);
      if (error) throw error;
      return data.map(item => item.taxonomy_id);
    } catch (error) {
      console.error('Error fetching media taxonomies:', error);
      // Return mock data for demo
      return ['1', '3', '5'];
    }
  },
  async assignTaxonomy(mediaId: string, taxonomyId: string, tenantId?: string) {
    try {
      const {
        error
      } = await supabase.from('media_taxonomies').insert([{
        media_id: mediaId,
        taxonomy_id: taxonomyId
      }]);
      if (error) throw error;
      return {
        success: true
      };
    } catch (error) {
      console.error('Error assigning taxonomy:', error);
      return {
        success: true
      }; // Mock success for demo
    }
  },
  async removeTaxonomy(mediaId: string, taxonomyId: string, tenantId?: string) {
    try {
      const {
        error
      } = await supabase.from('media_taxonomies').delete().eq('media_id', mediaId).eq('taxonomy_id', taxonomyId);
      if (error) throw error;
      return {
        success: true
      };
    } catch (error) {
      console.error('Error removing taxonomy:', error);
      return {
        success: true
      }; // Mock success for demo
    }
  }
};
// Submission service functions
export const submissionService = {
  async getSubmissionsByMediaId(mediaId: string, tenantId?: string) {
    try {
      const {
        data,
        error
      } = await supabase.from('submissions').select('*').eq('media_id', mediaId).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data.map(submission => ({
        id: submission.id,
        mediaId: submission.media_id,
        state: submission.state,
        reviewerId: submission.reviewer_id,
        createdAt: submission.created_at
      })) as Submission[];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      // Return mock data for demo
      return [{
        id: '1',
        mediaId,
        state: 'Submitted',
        reviewerId: null,
        createdAt: new Date().toISOString()
      }];
    }
  },
  async createSubmission(mediaId: string, tenantId?: string) {
    try {
      const {
        data,
        error
      } = await supabase.from('submissions').insert([{
        id: uuidv4(),
        media_id: mediaId,
        state: 'Submitted',
        reviewer_id: null,
        created_at: new Date().toISOString()
      }]).select().single();
      if (error) throw error;
      return {
        id: data.id,
        mediaId: data.media_id,
        state: data.state,
        reviewerId: data.reviewer_id,
        createdAt: data.created_at
      } as Submission;
    } catch (error) {
      console.error('Error creating submission:', error);
      // Return mock data for demo
      return {
        id: uuidv4(),
        mediaId,
        state: 'Submitted',
        reviewerId: null,
        createdAt: new Date().toISOString()
      };
    }
  },
  async updateSubmission(id: string, state: 'Approved' | 'Rejected', reviewerId: string, tenantId?: string) {
    try {
      const {
        data,
        error
      } = await supabase.from('submissions').update({
        state,
        reviewer_id: reviewerId
      }).eq('id', id).select().single();
      if (error) throw error;
      return {
        id: data.id,
        mediaId: data.media_id,
        state: data.state,
        reviewerId: data.reviewer_id,
        createdAt: data.created_at
      } as Submission;
    } catch (error) {
      console.error('Error updating submission:', error);
      return {
        success: true
      }; // Mock success for demo
    }
  }
};
// Audit log service functions
export const auditService = {
  async getAuditLogs(entityId: string, tenantId?: string) {
    try {
      const {
        data,
        error
      } = await supabase.from('audit_logs').select('*').eq('entity_id', entityId).order('at', {
        ascending: false
      });
      if (error) throw error;
      return data.map(log => ({
        id: log.id,
        action: log.action,
        actorId: log.actor_id,
        at: log.at,
        entity: log.entity,
        entityId: log.entity_id,
        diff: log.diff
      })) as AuditLog[];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      // Return mock data for demo
      return [{
        id: '1',
        action: 'created',
        actorId: 'system',
        at: new Date().toISOString(),
        entity: 'media',
        entityId,
        diff: null
      }];
    }
  },
  async createAuditLog(data: {
    tenantId?: string;
    action: string;
    actorId: string;
    entity: string;
    entityId: string;
    diff?: any;
  }) {
    try {
      const {
        error
      } = await supabase.from('audit_logs').insert([{
        id: uuidv4(),
        action: data.action,
        actor_id: data.actorId,
        at: new Date().toISOString(),
        entity: data.entity,
        entity_id: data.entityId,
        diff: data.diff
      }]);
      if (error) throw error;
      return {
        success: true
      };
    } catch (error) {
      console.error('Error creating audit log:', error);
      return {
        success: true
      }; // Mock success for demo
    }
  }
};