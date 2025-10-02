/**
 * User GraphQL Queries
 *
 * GraphQL queries for user management.
 */
import { gql } from '@apollo/client';
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      status
      lastLogin
    }
  }
`;
export const GET_ROLES = gql`
  query GetRoles {
    roles {
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
export const GET_USERS_AND_ROLES = gql`
  query GetUsersAndRoles {
    users {
      id
      name
      email
      role
      status
      lastLogin
    }
    roles {
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
export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      status
      lastLogin
    }
  }
`;