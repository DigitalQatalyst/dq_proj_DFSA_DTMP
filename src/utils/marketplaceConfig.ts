// ... existing imports
import { fetchRelatedMarketplaceItems } from "../services/marketplace";
import { getFallbackItems } from "./fallbackData";
// ... existing code
// Add a function to get related items with fallback
export const getRelatedItems = async (
  marketplaceType: string,
  itemId: string
) => {
  try {
    // Attempt to fetch related items from API
    const relatedItems = await fetchRelatedMarketplaceItems(
      marketplaceType,
      itemId,
      "",
      ""
    );
    // Return fetched items if available, otherwise return fallback items
    return relatedItems && relatedItems.length > 0
      ? relatedItems
      : getFallbackItems(marketplaceType);
  } catch (error) {
    console.error("Error fetching related items:", error);
    // Return fallback items on error
    return getFallbackItems(marketplaceType);
  }
};
// ... rest of the file
