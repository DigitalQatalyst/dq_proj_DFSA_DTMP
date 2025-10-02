/**
 * Preferences Types
 *
 * TypeScript interfaces for user preferences and notifications.
 */
/**
 * User preference setting
 */
export interface Preference {
  /** Unique identifier for the preference */
  id: string;
  /** Value of the preference (can be string, boolean, or number) */
  value: string | boolean | number;
}
/**
 * Notification setting
 */
export interface NotificationSetting {
  /** Unique identifier for the notification type */
  id: string;
  /** Whether the notification is enabled */
  enabled: boolean;
  /** Optional delivery channels */
  channels?: {
    /** Email notifications */
    email?: boolean;
    /** In-app notifications */
    inApp?: boolean;
    /** SMS notifications */
    sms?: boolean;
  };
}
/**
 * Language preference
 */
export enum Language {
  ENGLISH = 'en',
  ARABIC = 'ar',
  FRENCH = 'fr',
  SPANISH = 'es',
}
/**
 * Timezone preference
 */
export enum Timezone {
  GULF = 'gmt+4',
  EASTERN_EUROPE = 'gmt+3',
  GMT = 'gmt+0',
  EASTERN_US = 'gmt-5',
}
/**
 * Theme preference
 */
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}