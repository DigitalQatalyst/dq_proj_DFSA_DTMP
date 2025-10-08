// Lightweight client for the Knowledge Hub GraphQL API (NestJS server)
// Uses fetch so we don't add heavy dependencies.

type GqlResponse<T> = { data?: T; errors?: Array<{ message: string }>; };

const endpoint = (import.meta as any)?.env?.VITE_KNOWLEDGEHUB_GRAPHQL_URL || 'http://localhost:4000/graphql';

// GraphQL queries for the API
const QUERY_MEDIA_ITEMS = `
  query MediaItems($where: MediaItemWhereInput, $skip: Float, $take: Float, $orderBy: [MediaItemOrderByInput!]) {
    mediaItems(
      skip: $skip
      take: $take
      where: $where
      orderBy: $orderBy
    ) {
      id
      title
      summary
      publishedAt
      updatedAt
      typeField
      provider { name }
      mediaAssets { kind url mime variants }
      mediaItemTaxonomies { taxonomy { kind label key } }
    }
  }
`;

const QUERY_MEDIA_ITEM = `
  query MediaItem($id: String!) {
    mediaItem(where: { id: $id }) {
      id
      title
      summary
      body
      publishedAt
      updatedAt
      typeField
      provider { name }
      mediaAssets { kind url mime variants }
      mediaItemTaxonomies { taxonomy { kind label key } }
      podcastMetas { episodeNo }
      eventMetas { startAt endAt venue regUrl }
      reportMetas { pages fileSizeMb }
    }
  }
`;

// Map GraphQL MediaItem to the app's expected item shape (card/detail base)
function mapGqlItemToCard(item: any) {
  const mediaType = (item?.typeField || 'Resource').toString();
  const titleCase = (s: string) => s?.charAt(0).toUpperCase() + s?.slice(1).toLowerCase();
  const firstOfKind = (kind: string) => item?.mediaAssets?.find((a: any) => a?.kind === kind);
  const image = firstOfKind('Image');
  const video = firstOfKind('Video');
  const audio = firstOfKind('Audio');
  const taxos = item?.mediaItemTaxonomies?.map((mit: any) => mit?.taxonomy)?.filter(Boolean) || [];
  const byKind = (k: string) => taxos.filter((t: any) => t?.kind === k);
  const labelOf = (k: string) => byKind(k)[0]?.label || undefined;
  const tagLabels = taxos.map((t: any) => t?.label).filter(Boolean);
  return {
    id: item?.id,
    title: item?.title || 'Untitled',
    description: item?.summary || '',
    // Prefer full body content for detail views when available
    content: typeof item?.body === 'string' ? item.body : (item?.body?.html || undefined),
    mediaType: titleCase(mediaType),
    provider: { name: item?.provider?.name || 'Unknown Provider', logoUrl: null },
    imageUrl: image?.url || null,
    videoUrl: video?.url || null,
    audioUrl: audio?.url || null,
    tags: tagLabels,
    date: item?.publishedAt || undefined,
    lastUpdated: item?.updatedAt || undefined,
    domain: labelOf('Domain'),
    businessStage: labelOf('BusinessStage'),
    format: labelOf('Format'),
    popularity: labelOf('Popularity'),
  };
}

export async function fetchKnowledgeHubItems(params: { search?: string; pageSize?: number; page?: number }) {
  const { search = '', pageSize = 12, page = 1 } = params || {};
  const where = search
    ? { title: { contains: search, mode: 'Insensitive' as const }, status: 'Published', visibility: 'Public' }
    : { status: 'Published', visibility: 'Public' };
  // Order newest first (publishedAt desc, then updatedAt desc)
  const orderBy = [{ publishedAt: 'Desc' as const }, { updatedAt: 'Desc' as const }];
  const variables = { where, skip: (page - 1) * pageSize, take: pageSize, orderBy };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY_MEDIA_ITEMS, variables }),
  });
  const json = (await res.json()) as GqlResponse<{ mediaItems: any[] }>;
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
  const items = (json.data?.mediaItems || []).map(mapGqlItemToCard);
  return items;
}

export async function fetchKnowledgeHubItemById(id: string) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY_MEDIA_ITEM, variables: { id } }),
  });
  const json = (await res.json()) as GqlResponse<{ mediaItem: any }>;
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
  const item = json.data?.mediaItem;
  return item ? mapGqlItemToCard(item) : null;
}
