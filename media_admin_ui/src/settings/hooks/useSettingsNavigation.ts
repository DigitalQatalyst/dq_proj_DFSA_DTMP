/**
 * Custom hook for managing settings navigation
 *
 * Handles tab selection, URL synchronization, and tab configuration.
 * Uses Next.js 15 App Router navigation patterns.
 *
 * @returns Navigation state and handlers
 *
 * @example
 * ```tsx
 * const { activeTabIndex, tabs, handleTabChange } = useSettingsNavigation()
 * ```
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TabItem } from '../types/settings';
export function useSettingsNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get tab from URL or default to first tab
  const getInitialTabIndex = (): number => {
    const tab = searchParams.get('tab');
    if (tab === 'security') return 1;
    if (tab === 'preferences') return 2;
    if (tab === 'integrations') return 3;
    return 0; // Default to users tab
  };
  const [activeTabIndex, setActiveTabIndex] = useState(getInitialTabIndex());
  // Update tab when URL changes
  useEffect(() => {
    setActiveTabIndex(getInitialTabIndex());
  }, [searchParams]);
  // Define available tabs
  const tabs: TabItem[] = [{
    id: 'users-roles',
    title: 'Users & Roles',
    completion: 0,
    mandatoryCompletion: {
      percentage: 0
    }
  }, {
    id: 'security-compliance',
    title: 'Security & Compliance',
    completion: 0,
    mandatoryCompletion: {
      percentage: 0
    }
  }, {
    id: 'preferences-notifications',
    title: 'Preferences & Notifications',
    completion: 0,
    mandatoryCompletion: {
      percentage: 0
    }
  }, {
    id: 'integrations-billing',
    title: 'Integrations & Billing',
    completion: 0,
    mandatoryCompletion: {
      percentage: 0
    },
    comingSoon: true
  }];
  // Get tab parameter based on index
  const getTabParam = (index: number): string => {
    switch (index) {
      case 0:
        return 'users';
      case 1:
        return 'security';
      case 2:
        return 'preferences';
      case 3:
        return 'integrations';
      default:
        return 'users';
    }
  };
  // Handle tab change with URL update
  const handleTabChange = useCallback((index: number) => {
    setActiveTabIndex(index);
    // Update URL using Next.js App Router pattern
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', getTabParam(index));
    router.push(`/settings?${params.toString()}`, {
      scroll: false
    });
  }, [router, searchParams]);
  return {
    activeTabIndex,
    tabs,
    handleTabChange
  };
}