/**
 * Custom hook for checking settings access permissions
 *
 * Verifies if the current user has permission to access the settings page
 * based on their role and permissions.
 *
 * @returns Object containing access status and loading state
 *
 * @example
 * ```tsx
 * const { hasAccess, isLoading } = useSettingsPermissions()
 * ```
 */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
// GraphQL query to get current user data
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      email
      role
      permissions {
        resource
        actions
      }
    }
  }
`;
interface UseSettingsPermissionsResult {
  hasAccess: boolean;
  isLoading: boolean;
  error: Error | null;
}
export function useSettingsPermissions(): UseSettingsPermissionsResult {
  const {
    data,
    loading,
    error
  } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  // Check if user has settings access permission
  const hasAccess = useMemo(() => {
    if (!data?.currentUser) return false;
    // Check role-based access
    if (['admin', 'manager'].includes(data.currentUser.role)) {
      return true;
    }
    // Check explicit permissions
    const settingsPermission = data.currentUser.permissions?.find((p: any) => p.resource === 'settings');
    return settingsPermission?.actions.includes('view') || false;
  }, [data]);
  return {
    hasAccess: loading ? true : hasAccess,
    // Optimistic UI - assume access during loading
    isLoading: loading,
    error: error || null
  };
}