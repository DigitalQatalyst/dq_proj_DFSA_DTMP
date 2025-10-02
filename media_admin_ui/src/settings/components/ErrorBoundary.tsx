/**
 * Settings Error Fallback Component
 *
 * Displays a user-friendly error message when an error occurs in the Settings section.
 * Provides a way to recover from the error by retrying the operation.
 *
 * @component
 * @example
 * ```tsx
 * <ErrorBoundary FallbackComponent={ErrorFallback}>
 *   <SettingsContent />
 * </ErrorBoundary>
 * ```
 */
import React, { Component } from 'react';
import { FallbackProps } from 'react-error-boundary';
export default function ErrorFallback({
  error,
  resetErrorBoundary
}: FallbackProps) {
  return <div className="p-6 text-center">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Settings Error
      </h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-auto text-left w-full mb-4 text-sm text-red-600">
        {error.stack?.split('\n').slice(0, 3).join('\n')}
      </pre>
      <button onClick={resetErrorBoundary} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Try Again
      </button>
    </div>;
}