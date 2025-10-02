/**
 * Security Types
 *
 * TypeScript interfaces for security and compliance features.
 */
/**
 * Connected device information
 */
export interface ConnectedDevice {
  /** Unique identifier for the device */
  id: number;
  /** Device name and browser */
  name: string;
  /** Geographic location of the device */
  location: string;
  /** When the device was last active */
  lastActive: string;
  /** Whether this is the current device */
  isCurrent: boolean;
}
/**
 * Security settings configuration
 */
export interface SecuritySettings {
  /** Whether two-factor authentication is enabled */
  twoFactorEnabled: boolean;
  /** Whether single sign-on is enabled */
  ssoEnabled: boolean;
  /** Password policy settings */
  passwordPolicy: {
    /** Minimum password length */
    minLength: number;
    /** Whether to require uppercase letters */
    requireUppercase: boolean;
    /** Whether to require lowercase letters */
    requireLowercase: boolean;
    /** Whether to require numbers */
    requireNumbers: boolean;
    /** Whether to require special characters */
    requireSpecialChars: boolean;
    /** Password expiration in days (0 = never) */
    expirationDays: number;
  };
}
/**
 * Audit log entry
 */
export interface AuditLogEntry {
  /** Unique identifier for the log entry */
  id: string;
  /** User who performed the action */
  user: string;
  /** Action performed */
  action: string;
  /** Resource affected */
  resource: string;
  /** IP address of the user */
  ipAddress: string;
  /** Timestamp of the action */
  timestamp: string;
  /** Additional details about the action */
  details?: Record<string, any>;
}