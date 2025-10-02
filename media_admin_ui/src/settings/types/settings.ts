/**
 * Settings Types
 *
 * TypeScript interfaces for the Settings module.
 */
/**
 * Tab item in the settings navigation
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Display title of the tab */
  title: string;
  /** Completion percentage (0-100) */
  completion: number;
  /** Mandatory completion requirements */
  mandatoryCompletion: {
    /** Percentage of mandatory fields completed */
    percentage: number;
  };
  /** Whether the feature is coming soon */
  comingSoon?: boolean;
}
/**
 * Settings permission levels
 */
export enum PermissionLevel {
  NONE = 'none',
  VIEW = 'view',
  EDIT = 'edit',
  ADMIN = 'admin',
}
/**
 * User role in the system
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  ADVISOR = 'advisor',
}
/**
 * Permission object defining access rights
 */
export interface Permission {
  /** Resource being accessed */
  resource: string;
  /** Allowed actions on the resource */
  actions: string[];
}
/**
 * Settings section configuration
 */
export interface SettingsSection {
  /** Section identifier */
  id: string;
  /** Display title */
  title: string;
  /** Section description */
  description?: string;
  /** Required permission level to access */
  requiredPermission: PermissionLevel;
  /** Whether the section is enabled */
  enabled: boolean;
}