import React, { Suspense } from 'react';
/**
 * Settings Page - Main Entry Point
 *
 * Server component that serves as the entry point for the settings section.
 * Handles initial data loading and provides the layout structure.
 *
 * @page
 */

import SettingsLayout from './components/SettingsLayout';
import LoadingSpinner from './components/LoadingSpinner';
export default function SettingsPage() {
  return <Suspense fallback={<LoadingSpinner />}>
      <SettingsLayout />
    </Suspense>;
}