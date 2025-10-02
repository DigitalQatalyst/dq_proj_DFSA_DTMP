/**
 * Custom hook for fetching and managing users data
 *
 * Provides Apollo GraphQL integration for user and role data.
 *
 * @returns Object containing users data, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * const { users, roles, isLoading, error, refetch } = useUsers()
 * ```
 */
'use client';

import { useQuery } from '@apollo/client';
import { GET_USERS_AND_ROLES } from '../services/userQueries';
import { mockUsers, mockRoles } from '../services/userService';
import { User, Role } from '../types/user';
interface UseUsersResult {
  users: User[];
  roles: Role[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
export function useUsers(): UseUsersResult {
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(GET_USERS_AND_ROLES, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    onError: error => {
      console.error('Error fetching users and roles:', error);
    }
  });
  // In a real implementation, we would use the data from the query
  // For now, we'll use mock data
  return {
    users: data?.users || mockUsers,
    roles: data?.roles || mockRoles,
    isLoading: loading,
    error: error || null,
    refetch
  };
}