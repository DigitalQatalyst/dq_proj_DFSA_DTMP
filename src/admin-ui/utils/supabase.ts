import { getSupabase } from './supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export interface MediaItem {
  id: string
  title: string
  slug: string
  summary: string
  body: string
  type: 'Article' | 'Report' | 'Announcement' | 'Event' | 'Podcast' | 'Video' | 'Image'
  category?: string
  status: 'Draft' | 'InReview' | 'Scheduled' | 'Published' | 'Archived'
  visibility: 'Public' | 'Private'
  language: string
  publishedAt: string | null
  updatedAt: string
  createdAt: string
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
  tags?: string[]
}

export interface Asset {
  id: string
  mediaId: string
  storagePath: string
  publicUrl: string
  mime: string
  sizeBytes: number
  width: number | null
  height: number | null
  durationSec: number | null
  checksum: string
  kind?: 'Image' | 'Video' | 'Audio' | 'Doc'
}

export interface Taxonomy { id: string; kind: 'Domain' | 'Stage' | 'Format' | 'Tag'; label: string; key: string }
export interface Submission { id: string; mediaId: string; state: 'Submitted' | 'Approved' | 'Rejected'; reviewerId: string | null; createdAt: string }
export interface AuditLog { id: string; action: string; actorId: string; at: string; entity: string; entityId: string; diff: any }

export const mediaService = {
  async getMediaItems(
    filters: any = {},
    page = 1,
    pageSize = 10,
    orderBy = { field: 'publishedAt', direction: 'desc' as 'asc' | 'desc' },
  ) {
    let query = getSupabase().from('media_items').select('*', { count: 'exact' })
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.type) query = query.eq('type', filters.type)
    if (filters.visibility) query = query.eq('visibility', filters.visibility)
    if (filters.language) query = query.eq('language', filters.language)
    if (filters.search) query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`)

    const orderField = orderBy.field === 'publishedAt' ? 'published_at' : orderBy.field === 'updatedAt' ? 'updated_at' : 'created_at'
    query = query.order(orderField, { ascending: orderBy.direction === 'asc' })
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)
    const { data, error, count } = await query
    if (error) throw error
    const mapped = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      body: item.body,
      type: item.type,
      category: item.category,
      status: item.status,
      visibility: item.visibility,
      language: item.language,
      publishedAt: item.published_at,
      updatedAt: item.updated_at,
      createdAt: item.created_at,
      tags: item.tags || [],
    })) as MediaItem[]
    return { data: mapped, count: count || 0 }
  },

  async getMediaItemById(id: string) {
    const { data, error } = await getSupabase().from('media_items').select('*').eq('id', id).single()
    if (error) throw error
    const mapped: MediaItem = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      body: data.body,
      type: data.type,
      category: data.category,
      status: data.status,
      visibility: data.visibility,
      language: data.language,
      publishedAt: data.published_at,
      updatedAt: data.updated_at,
      createdAt: data.created_at,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      canonicalUrl: data.canonical_url,
      tags: data.tags || [],
    }
    return mapped
  },

  async createMediaItem(data: Partial<MediaItem>) {
    const payload = {
      id: uuidv4(),
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      body: data.body || '',
      type: data.type,
      category: data.category || null,
      status: data.status || 'Draft',
      visibility: data.visibility || 'Public',
      language: data.language || 'en',
      published_at: data.publishedAt || null,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      seo_title: data.seoTitle || null,
      seo_description: data.seoDescription || null,
      canonical_url: data.canonicalUrl || null,
      // Normalize tags to always include type and category
      tags: Array.from(new Set([...(data.tags || []), data.type, data.category].filter(Boolean as any))) as string[],
    }
    const { data: inserted, error } = await getSupabase().from('media_items').insert([payload]).select().single()
    if (error) throw error
    return {
      id: inserted.id,
      title: inserted.title,
      slug: inserted.slug,
      summary: inserted.summary,
      body: inserted.body,
      type: inserted.type,
      category: inserted.category,
      status: inserted.status,
      visibility: inserted.visibility,
      language: inserted.language,
      publishedAt: inserted.published_at,
      updatedAt: inserted.updated_at,
      createdAt: inserted.created_at,
      seoTitle: inserted.seo_title,
      seoDescription: inserted.seo_description,
      canonicalUrl: inserted.canonical_url,
    } as MediaItem
  },

  async updateMediaItem(id: string, data: Partial<MediaItem>) {
    const { data: updated, error } = await getSupabase()
      .from('media_items')
      .update({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        body: data.body,
        type: data.type,
        category: data.category,
        status: data.status,
        visibility: data.visibility,
        language: data.language,
        published_at: data.publishedAt,
        updated_at: new Date().toISOString(),
        seo_title: data.seoTitle,
        seo_description: data.seoDescription,
        canonical_url: data.canonicalUrl,
        // Normalize tags to include type and category uniquely
        tags: Array.from(new Set([...(data.tags || []), data.type, data.category].filter(Boolean as any))) as string[],
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return {
      id: updated.id,
      title: updated.title,
      slug: updated.slug,
      summary: updated.summary,
      body: updated.body,
      type: updated.type,
      category: updated.category,
      status: updated.status,
      visibility: updated.visibility,
      language: updated.language,
      publishedAt: updated.published_at,
      updatedAt: updated.updated_at,
      createdAt: updated.created_at,
      seoTitle: updated.seo_title,
      seoDescription: updated.seo_description,
      canonicalUrl: updated.canonical_url,
    } as MediaItem
  },

  async deleteMediaItem(id: string) {
    const { error } = await getSupabase().from('media_items').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  },

  async getStatusCounts() {
    const { data, error } = await getSupabase().from('media_items').select('status')
    if (error) throw error
    const counts: Record<string, number> = { Draft: 0, InReview: 0, Scheduled: 0, Published: 0, Archived: 0 }
    ;(data || []).forEach((m: any) => {
      if (counts.hasOwnProperty(m.status)) counts[m.status]++
    })
    return counts
  },
  async getAvailableTags(): Promise<string[]> {
    try {
      const { data, error } = await getSupabase().from('media_items').select('tags, type, category')
      if (error) throw error
      const allTags = (data || []).flatMap((r: any) => (Array.isArray(r?.tags) ? r.tags : []))
      const allTypes = (data || []).map((r: any) => r?.type).filter(Boolean)
      const allCats = (data || []).map((r: any) => r?.category).filter(Boolean)
      const all = [...allTags, ...allTypes, ...allCats]
      const uniq = Array.from(new Set(all.filter(Boolean))) as string[]
      // Sort alphabetically for nicer UX
      return uniq.sort((a, b) => a.localeCompare(b))
    } catch {
      // Fallback default tag set if query fails
      return ['Business', 'Finance', 'Technology', 'Marketing', 'Export', 'SME', 'Growth']
    }
  },
}

// Stubs for extended services used by MediaDetail (optional to flesh out later)
export const assetService = {
  async getAssetsByMediaId(_id: string) { return [] as Asset[] },
  async uploadAsset(_file: File, _id: string) { return {} as Asset },
  async deleteAsset(_assetId: string) { return { success: true } },
}

export const taxonomyService = {
  async getTaxonomies() { return [] as Taxonomy[] },
  async getMediaTaxonomies(_id: string) { return [] as string[] },
  async assignTaxonomy(_id: string, _taxId: string) { return { success: true } },
  async removeTaxonomy(_id: string, _taxId: string) { return { success: true } },
}

export const submissionService = {
  async getSubmissionsByMediaId(_id: string) { return [] as Submission[] },
  async createSubmission(_id: string) { return { success: true } },
}

export const auditService = {
  async getAuditLogs(_id: string) { return [] as AuditLog[] },
  async createAuditLog(_log: Partial<AuditLog>) { return { success: true } },
}





