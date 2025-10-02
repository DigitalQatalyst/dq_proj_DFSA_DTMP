import React, { useEffect, useState } from 'react';
import { DatabaseIcon, BarChartIcon, ShoppingCartIcon, KeyIcon, PlusIcon, CopyIcon, EyeIcon, EyeOffIcon, ChevronDownIcon, ChevronUpIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react';
// Mock data for integrations
const mockIntegrations = [{
  id: 1,
  name: 'Dataverse',
  description: 'Connect to Microsoft Dataverse to sync data',
  icon: DatabaseIcon,
  status: 'Coming Soon',
  lastSync: '-'
}, {
  id: 2,
  name: 'Vendure',
  description: 'E-commerce integration for product management',
  icon: ShoppingCartIcon,
  status: 'Coming Soon',
  lastSync: '-'
}, {
  id: 3,
  name: 'Power BI',
  description: 'Business intelligence and reporting integration',
  icon: BarChartIcon,
  status: 'Coming Soon',
  lastSync: '-'
}];
// Mock data for API tokens
const mockApiTokens = [{
  id: 1,
  name: 'Development API',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  created: '2023-08-15',
  lastUsed: '2 hours ago'
}, {
  id: 2,
  name: 'Production API',
  token: 'kJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  created: '2023-07-20',
  lastUsed: '3 days ago'
}];
export default function IntegrationsBillingTab() {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [visibleTokens, setVisibleTokens] = useState<Record<number, boolean>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
  const toggleTokenVisibility = (tokenId: number) => {
    setVisibleTokens(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }));
  };
  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };
  const toggleActionMenu = (tokenId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === tokenId ? null : tokenId);
  };
  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return <div className="space-y-6">
      {/* Coming Soon Banner */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
        <p className="text-center text-gray-600 font-medium">
          Integrations & Billing features are coming soon. The functionality
          below is for preview only.
        </p>
      </div>
      {/* Integrations Section */}
      <section className="opacity-60">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
          <button className="md:hidden" onClick={() => toggleSection('integrations')}>
            {expandedSection === 'integrations' ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
        {/* Desktop view: always visible */}
        <div className={`space-y-4 ${expandedSection === 'integrations' || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}`}>
          {mockIntegrations.map(integration => <div key={integration.id} className="bg-white p-4 border border-gray-200 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <integration.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 className="text-md font-medium text-gray-900">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {integration.description}
                      </p>
                      <div className="mt-2 flex items-center text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {integration.status}
                        </span>
                      </div>
                    </div>
                    <button disabled className="mt-3 sm:mt-0 px-3 py-1.5 bg-gray-300 text-gray-600 text-sm rounded-md cursor-not-allowed">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </section>
      {/* API Tokens Section */}
      <section className="opacity-60">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">API Tokens</h2>
          <div className="flex items-center">
            <button disabled className="inline-flex items-center px-3 py-1.5 bg-gray-300 text-gray-600 text-sm rounded-md cursor-not-allowed mr-2 sm:mr-0">
              <PlusIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Generate New Token</span>
              <span className="sm:hidden">New</span>
            </button>
            <button className="md:hidden ml-2" onClick={() => toggleSection('api-tokens')}>
              {expandedSection === 'api-tokens' ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
            </button>
          </div>
        </div>
        {/* Desktop Table View */}
        <div className={`hidden md:block bg-white overflow-hidden border border-gray-200 rounded-md`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockApiTokens.map(token => <tr key={token.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <KeyIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {token.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-500 font-mono">
                        {visibleTokens[token.id] ? token.token : '••••••••••••••••••••••••••••'}
                      </div>
                      <button disabled className="ml-2 text-gray-400 cursor-not-allowed">
                        {visibleTokens[token.id] ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                      <button disabled className="ml-1 text-gray-400 cursor-not-allowed">
                        <CopyIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {token.created}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {token.lastUsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button disabled className="text-gray-400 cursor-not-allowed mr-3">
                      Regenerate
                    </button>
                    <button disabled className="text-gray-400 cursor-not-allowed">
                      Revoke
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className={`md:hidden space-y-3 ${expandedSection === 'api-tokens' ? 'block' : 'hidden'}`}>
          {mockApiTokens.map(token => <div key={token.id} className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <KeyIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-900">
                      {token.name}
                    </h3>
                  </div>
                  <div className="relative">
                    <button onClick={e => toggleActionMenu(token.id, e)} className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                      <MoreVerticalIcon className="h-5 w-5" />
                    </button>
                    {/* Action Menu */}
                    {openActionMenuId === token.id && <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button disabled className="flex items-center px-4 py-2 text-sm text-gray-400 w-full text-left cursor-not-allowed">
                            <EyeIcon className="h-4 w-4 mr-2" />
                            {visibleTokens[token.id] ? 'Hide Token' : 'Show Token'}
                          </button>
                          <button disabled className="flex items-center px-4 py-2 text-sm text-gray-400 w-full text-left cursor-not-allowed">
                            <CopyIcon className="h-4 w-4 mr-2" />
                            Copy Token
                          </button>
                          <button disabled className="flex items-center px-4 py-2 text-sm text-gray-400 w-full text-left cursor-not-allowed">
                            <KeyIcon className="h-4 w-4 mr-2" />
                            Regenerate
                          </button>
                          <button disabled className="flex items-center px-4 py-2 text-sm text-gray-400 w-full text-left cursor-not-allowed">
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Revoke
                          </button>
                        </div>
                      </div>}
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">
                      {visibleTokens[token.id] ? token.token : '••••••••••••••••••••••••••••'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Created:</span>{' '}
                    {token.created}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Last Used:</span>{' '}
                    {token.lastUsed}
                  </p>
                </div>
              </div>
            </div>)}
        </div>
      </section>
      {/* Billing & Subscription Section (Coming Soon) */}
      <section className="opacity-60 cursor-not-allowed">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Billing & Subscription
            </h2>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              Coming Soon
            </span>
          </div>
          <button className="md:hidden" onClick={() => toggleSection('billing')}>
            {expandedSection === 'billing' ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
        <div className={`${expandedSection === 'billing' || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 border border-gray-200 rounded-md">
            <p className="text-gray-500">
              Manage your subscription plan, billing information, and payment
              history.
            </p>
          </div>
        </div>
      </section>
    </div>;
}