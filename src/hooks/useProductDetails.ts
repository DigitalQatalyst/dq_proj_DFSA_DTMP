import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT } from "../services/marketplaceQueries";
import {
  getFallbackItemDetails,
  getFallbackItems,
} from "../utils/fallbackData";

export interface UseProductDetailsArgs {
  itemId?: string;
  marketplaceType: "courses" | "financial" | "non-financial";
  shouldTakeAction?: boolean;
}

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  [key: string]: any;
}

export function useProductDetails({
  itemId,
  marketplaceType,
  shouldTakeAction,
}: UseProductDetailsArgs) {
  const [item, setItem] = useState<ProductItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);

  const { data, error, loading, refetch } = useQuery(GET_PRODUCT, {
    variables: { id: itemId || "" },
    skip: !itemId,
  });

  const mapProductToItem = (product: any): ProductItem | null => {
    if (!product) return null;
    const cf = (product as any).customFields || {};
    return {
      id: product.id,
      title: product.name,
      description: product.description,
      category: cf.Industry,
      businessStage: cf.BusinessStage,
      serviceType: cf.CustomerType,
      price: cf.Cost,
      processingTime: cf.ProcessingTime,
      amount: cf.Cost,
      details: Array.isArray(cf.Steps)
        ? cf.Steps
        : cf.TermsOfService
        ? [cf.TermsOfService]
        : [],
      requiredDocuments: Array.isArray(cf.RequiredDocuments)
        ? cf.RequiredDocuments.map((d: any) =>
            typeof d === "string" ? d : d?.name || d?.source || ""
          ).filter(Boolean)
        : [],
      // Prefer new fields for terms when available
      keyTerms:
        (Array.isArray(cf.KeyTermsOfService)
          ? cf.KeyTermsOfService.join(", ")
          : cf.KeyTermsOfService) ||
        (Array.isArray(cf.TermsOfService)
          ? cf.TermsOfService.join(", ")
          : cf.TermsOfService),
      additionalTerms: Array.isArray(cf.AdditionalTermsOfService)
        ? cf.AdditionalTermsOfService
        : cf.AdditionalTermsOfService
        ? [cf.AdditionalTermsOfService]
        : undefined,
      tags: [cf.Industry, cf.CustomerType, cf.BusinessStage].filter(Boolean),
      provider: {
        name: "Service Provider",
        logoUrl:
          (Array.isArray(cf.Logo) &&
            cf.Logo.length > 0 &&
            (cf.Logo[0] as any)?.source) ||
          (cf.Logo as any)?.source ||
          "/image.png",
      },
      providerLocation: "UAE",
    } as any;
  };

  useEffect(() => {
    if (!itemId) return;
    const product = (data as any)?.product;

    if (!product) {
      // fallback path if no product in response
      const fallback = getFallbackItemDetails(
        marketplaceType,
        itemId || "fallback-1"
      );
      if (fallback) {
        setItem(fallback);
        setRelatedItems(getFallbackItems(marketplaceType));
      }
      return;
    }

    const mapped = mapProductToItem(product);
    if (!mapped) return;

    // merge with fallback to fill gaps
    const fallbackForItem = getFallbackItemDetails(
      marketplaceType,
      itemId || "fallback-1"
    );
    const merged: any = { ...(fallbackForItem || {}), ...mapped };
    if (fallbackForItem) {
      for (const key of Object.keys(fallbackForItem)) {
        const val = merged[key];
        const shouldUseFallback =
          val === undefined ||
          val === null ||
          (Array.isArray(val) && val.length === 0) ||
          (typeof val === "string" && val.trim() === "");
        if (shouldUseFallback) {
          merged[key] = (fallbackForItem as any)[key];
        }
      }
      merged.provider = {
        ...(fallbackForItem as any).provider,
        ...(mapped as any).provider,
      };
    }

    setItem(merged);

    const rs = product?.customFields?.RelatedServices;
    const relatedFromGql = Array.isArray(rs)
      ? rs.map((x: any) => ({
          id: x.id,
          title: x.name,
          description: x.description || "",
          provider: {
            name: merged.provider?.name,
            logoUrl: merged.provider?.logoUrl,
          },
          tags: [],
        }))
      : [];
    const limitedRelated = relatedFromGql.slice(0, 3);
    const fallbackLimited = getFallbackItems(marketplaceType).slice(0, 3);
    const chosen = limitedRelated.length > 0 ? limitedRelated : fallbackLimited;
    const normalized = chosen
      .filter((x: any) => x?.id !== merged.id) // avoid showing the same item as related
      .slice(0, 3)
      .map((x: any) => ({
        id: x.id,
        title: x.title || x.name || "Related Service",
        description: x.description || "",
        provider: {
          name: x.provider?.name || merged.provider?.name || "Service Provider",
          logoUrl:
            x.provider?.logoUrl || merged.provider?.logoUrl || "/mzn_logo.png",
        },
        tags: Array.isArray(x.tags) ? x.tags : [],
      }));
    setRelatedItems(normalized);

    if (shouldTakeAction) {
      setTimeout(() => {
        document
          .getElementById("action-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [data, itemId, marketplaceType, shouldTakeAction]);

  return {
    item,
    relatedItems,
    loading,
    error,
    refetch,
  } as const;
}
