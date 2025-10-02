/**
 * Settings Breadcrumb Component
 *
 * Displays the navigation breadcrumb for the settings page.
 * Responsive design shows full path on desktop and simplified path on mobile.
 *
 * @component
 * @example
 * ```tsx
 * <SettingsBreadcrumb />
 * ```
 */
import React, { Component } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';
export default function SettingsBreadcrumb() {
  return <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 overflow-hidden">
            <li className="hidden sm:block">
              <Link href="/" className="hover:text-gray-700 flex items-center">
                Home
              </Link>
            </li>
            <li className="hidden sm:flex items-center">
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <Link href="/dashboard" className="hover:text-gray-700 flex items-center">
                Dashboard
              </Link>
            </li>
            <li className="flex items-center">
              {/* Only show previous level on mobile */}
              <span className="sm:hidden">
                <Link href="/dashboard" className="hover:text-gray-700 flex items-center">
                  <HomeIcon className="h-4 w-4 mr-1" />
                </Link>
              </span>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <span className="text-gray-900 font-medium truncate">
                Settings
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </div>;
}