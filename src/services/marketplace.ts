import { FilterConfig } from "../components/marketplace/FilterSidebar";
import { MarketplaceItem } from "../components/marketplace/MarketplaceGrid";
import { getMarketplaceConfig } from "../utils/marketplaceConfig";

/**
 * Fetches marketplace items based on marketplace type, filters, and search query
 */
export const fetchMarketplaceItems = async (
  marketplaceType: string,
  _filters: Record<string, string>,
  _searchQuery?: string
): Promise<any[]> => {
  try {
    const config = getMarketplaceConfig(marketplaceType);
    const items = config.mockData?.items || [];
    return config.mapListResponse ? config.mapListResponse(items) : items;
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} items:`, error);
    throw new Error(
      `Failed to load ${marketplaceType} items. Please try again later.`
    );
  }
};

/**
 * Fetches filter configurations for a specific marketplace type
 */
export const fetchMarketplaceFilters = async (
  marketplaceType: string
): Promise<FilterConfig[]> => {
  try {
    const config = getMarketplaceConfig(marketplaceType);
    const filterOptions = config.mockData?.filterOptions;
    if (filterOptions && config.mapFilterResponse) {
      return config.mapFilterResponse(filterOptions);
    }
    return config.filterCategories;
  } catch (error) {
    console.error(
      `Error fetching filter options for ${marketplaceType}:`,
      error
    );
    const config = getMarketplaceConfig(marketplaceType);
    return config.filterCategories;
  }
};

/**
 * Fetches details for a specific marketplace item
 */
export const fetchMarketplaceItemDetails = async (
  marketplaceType: string,
  itemId: string
): Promise<any> => {
  try {
    const config = getMarketplaceConfig(marketplaceType);
    const items = config.mockData?.items || [];
    const found = items.find((it: any) => String(it.id) === String(itemId));
    if (!found) throw new Error('Item not found');
    return config.mapDetailResponse ? config.mapDetailResponse(found) : found;
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} item details:`, error);
    throw new Error(`Failed to load item details. Please try again later.`);
  }
};

/**
 * Fetches related items for a specific marketplace item
 */
export const fetchRelatedMarketplaceItems = async (
  marketplaceType: string,
  itemId: string,
  category: string,
  provider: string
): Promise<any[]> => {
  try {
    const config = getMarketplaceConfig(marketplaceType);
    const items = (config.mockData?.items || []).filter((it: any) => String(it.id) !== String(itemId));
    const related = items.filter((it: any) => {
      const sameCategory = category ? it.category === category : true;
      const sameProvider = provider ? (it.provider === provider || it.providerId === provider) : true;
      return sameCategory && sameProvider;
    });
    return config.mapListResponse ? config.mapListResponse(related) : related;
  } catch (error) {
    console.error(`Error fetching related ${marketplaceType} items:`, error);
    throw new Error(`Failed to load related items. Please try again later.`);
  }
};

/**
 * Fetches providers for a specific marketplace type
 */
export const fetchMarketplaceProviders = async (
  marketplaceType: string
): Promise<any[]> => {
  try {
    const config = getMarketplaceConfig(marketplaceType);
    return config.mockData?.providers || [];
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} providers:`, error);
    throw new Error(`Failed to load providers. Please try again later.`);
  }
};
