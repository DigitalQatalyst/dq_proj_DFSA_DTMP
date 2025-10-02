/**
 * Settings Layout Component
 *
 * Main layout wrapper for the Settings page. Handles the overall structure,
 * tab navigation, and content rendering based on the active tab.
 *
 * @component
 * @example
 * ```tsx
 * <SettingsLayout />
 * ```
 */
import React, { useState, Component } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { Header, AuthProvider } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Sidebar } from '../../components/AppSidebar';
import SettingsBreadcrumb from './SettingsBreadcrumb';
import SettingsTabNavigation from './SettingsTabNavigation';
import ErrorFallback from './ErrorBoundary';
import { useSettingsNavigation } from '../hooks/useSettingsNavigation';
import { useSettingsPermissions } from '../hooks/useSettingsPermissions';
import LoadingSpinner from './LoadingSpinner';
// Dynamically import tab components for code splitting
const UserRolesTab = dynamic(() => import('../users/components/UserRolesTab'), {
  loading: () => <LoadingSpinner />
});
const SecurityComplianceTab = dynamic(() => import('../security/components/SecurityComplianceTab'), {
  loading: () => <LoadingSpinner />
});
const PreferencesNotificationsTab = dynamic(() => import('../preferences/components/PreferencesNotificationsTab'), {
  loading: () => <LoadingSpinner />
});
const IntegrationsBillingTab = dynamic(() => import('../integrations/components/IntegrationsBillingTab'), {
  loading: () => <LoadingSpinner />
});
export default function SettingsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    activeTabIndex,
    tabs,
    handleTabChange
  } = useSettingsNavigation();
  const {
    hasAccess,
    isLoading: permissionsLoading
  } = useSettingsPermissions();
  if (permissionsLoading) {
    return <LoadingSpinner />;
  }
  if (!hasAccess) {
    return <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your
            administrator.
          </p>
        </div>
      </div>;
  }
  // Render the appropriate tab content based on active tab index
  const renderTabContent = () => {
    switch (activeTabIndex) {
      case 0:
        return <ErrorBoundary FallbackComponent={ErrorFallback}>
            <UserRolesTab />
          </ErrorBoundary>;
      case 1:
        return <ErrorBoundary FallbackComponent={ErrorFallback}>
            <SecurityComplianceTab />
          </ErrorBoundary>;
      case 2:
        return <ErrorBoundary FallbackComponent={ErrorFallback}>
            <PreferencesNotificationsTab />
          </ErrorBoundary>;
      case 3:
        return <ErrorBoundary FallbackComponent={ErrorFallback}>
            <IntegrationsBillingTab />
          </ErrorBoundary>;
      default:
        return <ErrorBoundary FallbackComponent={ErrorFallback}>
            <UserRolesTab />
          </ErrorBoundary>;
    }
  };
  return <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex flex-1">
          {/* Sidebar - hidden by default on mobile */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeSection="settings" onSectionChange={section => console.log(`Changed to ${section}`)} />
          {/* Main content area - takes full width on mobile */}
          <div className="flex-1 w-full">
            {/* Breadcrumb navigation */}
            <SettingsBreadcrumb />
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="border-b border-gray-200">
                  <SettingsTabNavigation tabs={tabs} activeTabIndex={activeTabIndex} onTabChange={handleTabChange} />
                </div>
                {/* Tab Content - adjust padding for mobile/desktop */}
                <div className="p-4 md:p-6">{renderTabContent()}</div>
              </div>
            </div>
          </div>
        </div>
        <Footer isLoggedIn={true} />
      </div>
      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
    </AuthProvider>;
}