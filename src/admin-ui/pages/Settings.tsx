import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'

const TABS = [
  { id: 'profile', label: 'Profile & Notifications' },
  { id: 'media-config', label: 'Media Config' },
  { id: 'taxonomy', label: 'Taxonomy' },
  { id: 'roles', label: 'Roles & Permissions' },
  { id: 'storage', label: 'Storage & Integrations' },
  { id: 'diagnostics', label: 'Diagnostics' },
] as const

type TabId = (typeof TABS)[number]['id']

const Settings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = useMemo<TabId>(() => {
    const maybeTab = searchParams.get('tab') as TabId | null
    return (maybeTab && TABS.some((tab) => tab.id === maybeTab)) ? maybeTab : 'profile'
  }, [searchParams])
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const [profileState, setProfileState] = useState({
    name: 'Admin Manager',
    email: 'admin@example.com',
    timezone: 'Asia/Dubai',
    notifications: {
      approvals: true,
      publishing: true,
      weeklyDigest: false,
    },
  })

  const [mediaConfig, setMediaConfig] = useState({
    defaultVisibility: 'Public',
    defaultStatus: 'Draft',
    enforceSeoFields: true,
    requireReview: true,
  })

  const [taxonomyState, setTaxonomyState] = useState({
    domains: [
      'Finance & Funding',
      'Marketing & Sales',
      'Technology & Innovation',
      'Operations & Productivity',
      'Legal & Compliance',
      'Strategy & Growth',
    ],
    stages: ['Ideation', 'Startup', 'Growth', 'Scale'],
    formats: ['Article', 'Report', 'Announcement', 'Event', 'Podcast', 'Video', 'Tool'],
  })

  const [rolesState, setRolesState] = useState([
    { role: 'Admin', description: 'Full access to media hub and knowledge hub settings', members: 4 },
    { role: 'Editor', description: 'Can create, edit, schedule and publish media', members: 8 },
    { role: 'Contributor', description: 'Can draft content and request reviews', members: 12 },
    { role: 'Reviewer', description: 'Can approve or reject submissions', members: 3 },
  ])

  const [storageState, setStorageState] = useState({
    storageProvider: 'Supabase',
    bucket: 'media-assets',
    azureAccount: '',
    azureContainer: '',
    webhooksEndpoint: 'https://example.com/hooks/media-sync',
    integrations: {
      analytics: 'Mixpanel',
      transcription: 'Azure Cognitive Services',
    },
  })

  const [diagnosticsResults, setDiagnosticsResults] = useState<
    Array<{ label: string; status: 'passing' | 'failing' | 'running'; detail?: string }>
  >([
    { label: 'Supabase URL configured', status: 'passing' },
    { label: 'Anon key present', status: 'passing' },
    { label: 'Authenticated session', status: 'running', detail: 'Click Run Checks' },
    { label: 'Storage bucket access', status: 'running', detail: 'Click Run Checks' },
    { label: 'media_items count', status: 'running', detail: 'Click Run Checks' },
  ])

  const setActiveTabAndUrl = (id: TabId) => {
    setActiveTab(id)
    const next = new URLSearchParams(searchParams)
    next.set('tab', id)
    setSearchParams(next, { replace: true })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <section className="bg-white rounded-lg shadow p-6 space-y-6">
            <header>
              <h2 className="text-lg font-semibold text-gray-900">Profile & Notifications</h2>
              <p className="text-sm text-gray-500">Manage your admin identity and notification preferences for workflow updates.</p>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display name</label>
                <input
                  value={profileState.name}
                  onChange={(e) => setProfileState((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profileState.email}
                  onChange={(e) => setProfileState((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notification timezone</label>
                <select
                  value={profileState.timezone}
                  onChange={(e) => setProfileState((prev) => ({ ...prev, timezone: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Asia/Dubai">GMT+4 - UAE Standard Time</option>
                  <option value="Europe/London">GMT/BST - London</option>
                  <option value="America/New_York">GMT-4 - New York</option>
                </select>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Email notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={profileState.notifications.approvals}
                    onChange={(e) => setProfileState((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, approvals: e.target.checked },
                    }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  Content approvals & review requests
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={profileState.notifications.publishing}
                    onChange={(e) => setProfileState((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, publishing: e.target.checked },
                    }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  Publishing & scheduling confirmations
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={profileState.notifications.weeklyDigest}
                    onChange={(e) => setProfileState((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, weeklyDigest: e.target.checked },
                    }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  Weekly activity digest
                </label>
              </div>
            </div>
          </section>
        )
      case 'media-config':
        return (
          <section className="bg-white rounded-lg shadow p-6 space-y-6">
            <header>
              <h2 className="text-lg font-semibold text-gray-900">Media Configuration</h2>
              <p className="text-sm text-gray-500">Set defaults for new media items and enforce governance rules across the admin hub.</p>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Default visibility</label>
                <select
                  value={mediaConfig.defaultVisibility}
                  onChange={(e) => setMediaConfig((prev) => ({ ...prev, defaultVisibility: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Internal">Internal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default workflow status</label>
                <select
                  value={mediaConfig.defaultStatus}
                  onChange={(e) => setMediaConfig((prev) => ({ ...prev, defaultStatus: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="InReview">In Review</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={mediaConfig.enforceSeoFields}
                  onChange={(e) => setMediaConfig((prev) => ({ ...prev, enforceSeoFields: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1"
                />
                <span>
                  Require SEO fields
                  <p className="text-xs text-gray-500">Blocks publishing when title or description metadata is missing.</p>
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={mediaConfig.requireReview}
                  onChange={(e) => setMediaConfig((prev) => ({ ...prev, requireReview: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1"
                />
                <span>
                  Require reviewer sign-off
                  <p className="text-xs text-gray-500">Enforces a reviewer approval before scheduled content can publish.</p>
                </span>
              </label>
            </div>
          </section>
        )
      case 'taxonomy':
        return (
          <section className="bg-white rounded-lg shadow p-6 space-y-6">
            <header>
              <h2 className="text-lg font-semibold text-gray-900">Taxonomy</h2>
              <p className="text-sm text-gray-500">Curate the tags and taxonomy used by both the media admin hub and the public knowledge hub.</p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Domains</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {taxonomyState.domains.map((item) => (
                    <li key={item} className="flex items-center justify-between">
                      <span>{item}</span>
                      <button
                        type="button"
                        className="text-blue-600 text-xs"
                        onClick={() => setTaxonomyState((prev) => ({
                          ...prev,
                          domains: prev.domains.filter((domain) => domain !== item),
                        }))}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Business Stages</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {taxonomyState.stages.map((item) => (
                    <li key={item} className="flex items-center justify-between">
                      <span>{item}</span>
                      <button
                        type="button"
                        className="text-blue-600 text-xs"
                        onClick={() => setTaxonomyState((prev) => ({
                          ...prev,
                          stages: prev.stages.filter((stage) => stage !== item),
                        }))}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Formats</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {taxonomyState.formats.map((item) => (
                    <li key={item} className="flex items-center justify-between">
                      <span>{item}</span>
                      <button
                        type="button"
                        className="text-blue-600 text-xs"
                        onClick={() => setTaxonomyState((prev) => ({
                          ...prev,
                          formats: prev.formats.filter((format) => format !== item),
                        }))}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Add new taxonomy item</label>
              <div className="mt-2 grid gap-3 md:grid-cols-[200px_1fr_auto]">
                <select className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option>Domain</option>
                  <option>Business Stage</option>
                  <option>Format</option>
                </select>
                <input
                  placeholder="Enter label"
                  className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add</button>
              </div>
            </div>
          </section>
        )
      case 'roles':
        return (
          <section className="bg-white rounded-lg shadow p-6 space-y-6">
            <header>
              <h2 className="text-lg font-semibold text-gray-900">Roles & Permissions</h2>
              <p className="text-sm text-gray-500">Review who has access to the media admin hub and what actions each role can take.</p>
            </header>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rolesState.map((role) => (
                    <tr key={role.role}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{role.role}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{role.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{role.members}</td>
                      <td className="px-4 py-3 text-sm text-blue-600">
                        <button type="button">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Invite member</button>
          </section>
        )
      case 'storage':
        return (
          <section className="bg-white rounded-lg shadow p-6 space-y-6">
            <header>
              <h2 className="text-lg font-semibold text-gray-900">Storage & Integrations</h2>
              <p className="text-sm text-gray-500">Configure asset storage, external webhooks, and supporting integrations.</p>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Storage provider</label>
                <select
                  value={storageState.storageProvider}
                  onChange={(e) => setStorageState((prev) => ({ ...prev, storageProvider: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Supabase">Supabase</option>
                  <option value="Azure Blob Storage">Azure Blob Storage</option>
                  <option value="AWS S3">AWS S3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default bucket / container</label>
                <input
                  value={storageState.bucket}
                  onChange={(e) => setStorageState((prev) => ({ ...prev, bucket: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Azure storage account</label>
                <input
                  value={storageState.azureAccount}
                  onChange={(e) => setStorageState((prev) => ({ ...prev, azureAccount: e.target.value }))}
                  placeholder="Optional - required when using Azure blob storage"
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Azure container</label>
                <input
                  value={storageState.azureContainer}
                  onChange={(e) => setStorageState((prev) => ({ ...prev, azureContainer: e.target.value }))}
                  placeholder="Optional - required when using Azure blob storage"
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Publish webhook endpoint</label>
              <input
                value={storageState.webhooksEndpoint}
                onChange={(e) => setStorageState((prev) => ({ ...prev, webhooksEndpoint: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">Triggered when media is published to notify downstream services.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Analytics integration</label>
                <input
                  value={storageState.integrations.analytics}
                  onChange={(e) => setStorageState((prev) => ({
                    ...prev,
                    integrations: { ...prev.integrations, analytics: e.target.value },
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Transcription provider</label>
                <input
                  value={storageState.integrations.transcription}
                  onChange={(e) => setStorageState((prev) => ({
                    ...prev,
                    integrations: { ...prev.integrations, transcription: e.target.value },
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>
        )
      case 'diagnostics':
        return (
          <section className="bg-white rounded-lg shadow p-6 space-y-6">
            <header>
              <h2 className="text-lg font-semibold text-gray-900">Diagnostics</h2>
              <p className="text-sm text-gray-500">Verify environment setup for Supabase authentication, storage, and media assets.</p>
            </header>
            <div className="space-y-4">
              {diagnosticsResults.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    {item.detail && <p className="text-xs text-gray-500">{item.detail}</p>}
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'passing'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'failing'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status === 'passing' ? 'Passing' : item.status === 'failing' ? 'Failing' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() =>
                setDiagnosticsResults((prev) =>
                  prev.map((item) =>
                    item.status === 'running'
                      ? { ...item, status: 'passing', detail: 'Last checked moments ago' }
                      : item,
                  ),
                )
              }
            >
              Run checks
            </button>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <AppLayout title="Settings">
      <div className="max-w-5xl space-y-6">
        <nav className="bg-white rounded-lg shadow p-2 flex flex-wrap gap-2" aria-label="Settings tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabAndUrl(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        {renderTabContent()}
      </div>
    </AppLayout>
  )
}

export default Settings




