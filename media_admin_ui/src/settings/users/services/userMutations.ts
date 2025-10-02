/**
 * User GraphQL Mutations
 *
 * GraphQL mutations for user management.
 */
import { gql } from '@apollo/client';
export const INVITE_USER_MUTATION = gql`
  mutation InviteUser($input: UserInviteInput!) {
    inviteUser(input: $input) {
      id
      name
      email
      role
      status
      lastLogin
    }
  }
`;
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      success
    }
  }
`;
export const UPDATE_USER_ROLE_MUTATION = gql`
  mutation UpdateUserRole($userId: ID!, $roleId: ID!) {
    updateUserRole(userId: $userId, roleId: $roleId) {
      id
      name
      email
      role
      status
      lastLogin
    }
  }
`;
export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($input: RoleInput!) {
    createRole(input: $input) {
      id
      name
      description
      permissions {
        name
        access
      }
    }
  }
`;