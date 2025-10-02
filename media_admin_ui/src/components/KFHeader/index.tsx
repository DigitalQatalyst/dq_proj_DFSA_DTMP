import React from 'react';
export { Header } from './Header';
export { ProfileDropdown } from './ProfileDropdown';
export { NotificationsMenu } from './notifications/NotificationsMenu';
export { NotificationCenter } from './notifications/NotificationCenter';
export { NotificationItem } from './notifications/NotificationItem';
export { ExploreDropdown } from './components/ExploreDropdown';
export { MobileDrawer } from './components/MobileDrawer';
// Deprecate the local AuthContext: reuse the main app AuthContext
export { useAuth } from '../../../../src/components/Header/context/AuthContext';
// Provide a no-op AuthProvider for compatibility (children-only)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export { mockNotifications } from './utils/mockNotifications';
export type { Notification } from './utils/mockNotifications';
