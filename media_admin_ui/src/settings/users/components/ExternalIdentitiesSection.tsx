/**
 * External Identities Section Component
 *
 * Displays the External Identities & SSO section (coming soon).
 *
 * @component
 * @example
 * ```tsx
 * <ExternalIdentitiesSection
 *   expandedRoleId={expandedRoleId}
 *   toggleRoleExpand={toggleRoleExpand}
 * />
 * ```
 */
import React, { Component } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
interface ExternalIdentitiesSectionProps {
  expandedRoleId: number | null;
  toggleRoleExpand: (roleId: number) => void;
}
export default function ExternalIdentitiesSection({
  expandedRoleId,
  toggleRoleExpand
}: ExternalIdentitiesSectionProps) {
  // Special ID for this section
  const SECTION_ID = 999;
  // Client-side check for window
  const isMobile = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  };
  return <section>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            External Identities & SSO
          </h2>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            Coming Soon
          </span>
        </div>
        <button className="md:hidden" onClick={() => toggleRoleExpand(SECTION_ID)} aria-expanded={expandedRoleId === SECTION_ID} aria-controls="external-identities-content">
          {expandedRoleId === SECTION_ID ? <ChevronUpIcon className="h-5 w-5 text-gray-500" aria-hidden="true" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />}
        </button>
      </div>
      {/* Desktop: Show with reduced opacity */}
      <div className="hidden md:block opacity-50 cursor-not-allowed">
        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <p className="text-gray-500">
            Configure Single Sign-On and manage external identity providers.
          </p>
        </div>
      </div>
      {/* Mobile: Collapsed by default */}
      {(expandedRoleId === SECTION_ID || !isMobile()) && <div className="md:hidden opacity-50 cursor-not-allowed" id="external-identities-content">
          <div className="bg-white p-4 border border-gray-200 rounded-md">
            <p className="text-gray-500">
              Configure Single Sign-On and manage external identity providers.
            </p>
          </div>
        </div>}
    </section>;
}