/**
 * User Types
 *
 * TypeScript interfaces for user management.
 */
/**
 * User entity
 */
export interface User {
  /** Unique identifier for the user */
  id: number;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's role in the system */
  role: string;
  /** User's account status */
  status: 'Active' | 'Inactive' | 'Pending';
  /** Timestamp of user's last login */
  lastLogin: string;
}
/**
 * Role entity
 */
export interface Role {
  /** Unique identifier for the role */
  id: number;
  /** Name of the role */
  name: string;
  /** Description of the role's purpose */
  description: string;
  /** Permissions assigned to the role */
  permissions: RolePermission[];
}
/**
 * Permission assigned to a role
 */
export interface RolePermission {
  /** Name of the permission */
  name: string;
  /** Access level for the permission */
  access: 'Full' | 'View Only' | 'None';
}
/**
 * Data for inviting a new user
 */
export interface UserInviteData {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** ID of the role to assign */
  roleId: string;
}
/**
 * Data for creating a new role
 */
export interface RoleCreateData {
  /** Name of the role */
  name: string;
  /** Description of the role's purpose */
  description: string;
  /** Permissions to assign to the role */
  permissions: RolePermission[];
}