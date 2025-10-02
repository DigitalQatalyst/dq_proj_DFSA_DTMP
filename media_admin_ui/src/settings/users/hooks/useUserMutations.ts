/**
 * Custom hook for user mutations
 *
 * Provides Apollo GraphQL mutations for user management operations.
 *
 * @returns Object containing mutation functions and loading/error states
 *
 * @example
 * ```tsx
 * const { inviteUser, deleteUser, updateUserRole, isLoading } = useUserMutations()
 * ```
 */
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_USER_MUTATION, INVITE_USER_MUTATION, UPDATE_USER_ROLE_MUTATION } from '../services/userMutations';
import { GET_USERS_AND_ROLES } from '../services/userQueries';
import { UserInviteData } from '../types/user';
interface UseUserMutationsResult {
  inviteUser: (userData: UserInviteData) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  updateUserRole: (userId: number, roleId: number) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}
export function useUserMutations(): UseUserMutationsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // Invite User Mutation
  const [inviteUserMutation] = useMutation(INVITE_USER_MUTATION, {
    refetchQueries: [{
      query: GET_USERS_AND_ROLES
    }],
    onError: error => {
      console.error('Error inviting user:', error);
      setError(error);
    }
  });
  // Delete User Mutation
  const [deleteUserMutation] = useMutation(DELETE_USER_MUTATION, {
    update(cache, {
      data: {
        deleteUser
      }
    }) {
      // Update cache to remove deleted user
      cache.modify({
        fields: {
          users(existingUsers = [], {
            readField
          }) {
            return existingUsers.filter((userRef: any) => readField('id', userRef) !== deleteUser.id);
          }
        }
      });
    },
    onError: error => {
      console.error('Error deleting user:', error);
      setError(error);
    }
  });
  // Update User Role Mutation
  const [updateUserRoleMutation] = useMutation(UPDATE_USER_ROLE_MUTATION, {
    onError: error => {
      console.error('Error updating user role:', error);
      setError(error);
    }
  });
  // Invite User Function
  const inviteUser = async (userData: UserInviteData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // For demo purposes, we'll just simulate the mutation
      console.log('Inviting user:', userData);
      // In a real implementation, we would use the mutation
      /*
      await inviteUserMutation({
        variables: { input: userData },
        optimisticResponse: {
          inviteUser: {
            id: Math.floor(Math.random() * -1000), // Temporary negative ID
            name: userData.name,
            email: userData.email,
            role: userData.roleId,
            status: 'Pending',
            lastLogin: 'Never',
            __typename: 'User'
          }
        }
      })
      */
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to invite user');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  // Delete User Function
  const deleteUser = async (userId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // For demo purposes, we'll just simulate the mutation
      console.log('Deleting user:', userId);
      // In a real implementation, we would use the mutation
      /*
      await deleteUserMutation({
        variables: { id: userId },
        optimisticResponse: {
          deleteUser: {
            id: userId,
            __typename: 'User'
          }
        }
      })
      */
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete user');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  // Update User Role Function
  const updateUserRole = async (userId: number, roleId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // For demo purposes, we'll just simulate the mutation
      console.log('Updating user role:', {
        userId,
        roleId
      });
      // In a real implementation, we would use the mutation
      /*
      await updateUserRoleMutation({
        variables: { userId, roleId },
        optimisticResponse: {
          updateUserRole: {
            id: userId,
            role: roleId,
            __typename: 'User'
          }
        }
      })
      */
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update user role');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return {
    inviteUser,
    deleteUser,
    updateUserRole,
    isLoading,
    error
  };
}