import React, { useState, Component } from 'react';
import AppLayout from '../components/AppLayout';
import { UserIcon, SettingsIcon, TagIcon, ShieldIcon, HardDriveIcon, ActivityIcon, BellIcon, GlobeIcon, ClockIcon, EyeIcon, CalendarIcon, UsersIcon, KeyIcon, DatabaseIcon, FileTextIcon, LockIcon, KeySquareIcon, ServerIcon, HistoryIcon } from 'lucide-react';
import DiagnosticsTab from '../components/DiagnosticsTab';
// Tab interface
interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const tabs: SettingsTab[] = [{
    id: 'profile',
    label: 'Profile & Preferences',
    icon: <UserIcon className="h-5 w-5" />
  }, {
    id: 'config',
    label: 'Media Hub Configuration',
    icon: <SettingsIcon className="h-5 w-5" />
  }, {
    id: 'taxonomy',
    label: 'Taxonomy Management',
    icon: <TagIcon className="h-5 w-5" />
  }, {
    id: 'roles',
    label: 'Roles & Permissions',
    icon: <ShieldIcon className="h-5 w-5" />
  }, {
    id: 'storage',
    label: 'Assets & Storage',
    icon: <HardDriveIcon className="h-5 w-5" />
  }, {
    id: 'audit',
    label: 'Audit & Security',
    icon: <ActivityIcon className="h-5 w-5" />
  }, {
    id: 'diagnostics',
    label: 'Diagnostics',
    icon: <div className="h-5 w-5" />
  }];
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePreferencesTab />;
      case 'config':
        return <MediaHubConfigTab />;
      case 'taxonomy':
        return <TaxonomyManagementTab />;
      case 'roles':
        return <RolesPermissionsTab />;
      case 'storage':
        return <AssetsStorageTab />;
      case 'audit':
        return <AuditSecurityTab />;
      case 'diagnostics':
        return <DiagnosticsTab />;
      default:
        return <ProfilePreferencesTab />;
    }
  };
  return <AppLayout title="Settings">
      <div className="mb-6">
        
        <p className="text-gray-600">
          Configure your Media Hub settings and preferences
        </p>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 border-r border-gray-200">
            <nav className="p-4">
              <ul className="space-y-1">
                {tabs.map(tab => <li key={tab.id}>
                    <button onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center px-4 py-3 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                      <span className="mr-3">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>)}
              </ul>
            </nav>
          </div>
          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">{renderTabContent()}</div>
        </div>
      </div>
    </AppLayout>;
};
// Tab Components
const ProfilePreferencesTab: React.FC = () => {
  return <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Profile Information
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input type="text" id="name" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="Admin User" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input type="email" id="email" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="admin@example.com" />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input type="text" id="role" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 sm:text-sm" value="Administrator" readOnly />
            </div>
            <div>
              <label htmlFor="joined" className="block text-sm font-medium text-gray-700 mb-1">
                Joined Date
              </label>
              <input type="text" id="joined" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 sm:text-sm" value="Jan 15, 2023" readOnly />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Notification Preferences
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <BellIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Content Updates
                </h3>
                <p className="text-sm text-gray-500">
                  Receive notifications when content is updated or published
                </p>
              </div>
            </div>
            <div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <BellIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Review Requests
                </h3>
                <p className="text-sm text-gray-500">
                  Receive notifications for new review requests
                </p>
              </div>
            </div>
            <div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <BellIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  System Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Receive system updates and maintenance notifications
                </p>
              </div>
            </div>
            <div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Language & Timezone
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GlobeIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                  Language
                </label>
                <select id="language" className="block w-full sm:max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="en">
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                  Time Zone
                </label>
                <select id="timezone" className="block w-full sm:max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="gmt+4">
                  <option value="gmt+4">(GMT+4) Gulf Standard Time</option>
                  <option value="gmt+3">(GMT+3) Eastern European Time</option>
                  <option value="gmt+0">(GMT+0) Greenwich Mean Time</option>
                  <option value="gmt-5">(GMT-5) Eastern Standard Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
          Cancel
        </button>
        <button type="button" className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Save Changes
        </button>
      </div>
    </div>;
};
const MediaHubConfigTab: React.FC = () => {
  return <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Publishing Defaults
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label htmlFor="default-visibility" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                  Default Visibility
                </label>
                <select id="default-visibility" className="block w-full sm:max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="public">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileTextIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label htmlFor="default-status" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                  Default Status
                </label>
                <select id="default-status" className="block w-full sm:max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="draft">
                  <option value="draft">Draft</option>
                  <option value="inReview">In Review</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Visibility Rules
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <EyeIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Require Approval
                </h3>
                <p className="text-sm text-gray-500">
                  Require approval before publishing content
                </p>
              </div>
            </div>
            <div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <EyeIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Public By Default
                </h3>
                <p className="text-sm text-gray-500">
                  Make new content public by default
                </p>
              </div>
            </div>
            <div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Scheduling Defaults
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label htmlFor="publish-time" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                  Default Publish Time
                </label>
                <input type="time" id="publish-time" className="block w-full sm:max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="09:00" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Auto-Schedule
                </h3>
                <p className="text-sm text-gray-500">
                  Automatically schedule content for the next day when approved
                  after hours
                </p>
              </div>
            </div>
            <div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
          Cancel
        </button>
        <button type="button" className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Save Changes
        </button>
      </div>
    </div>;
};
const TaxonomyManagementTab: React.FC = () => {
  const [taxonomies, setTaxonomies] = useState([{
    id: 1,
    name: 'Technology',
    type: 'Domain',
    count: 42
  }, {
    id: 2,
    name: 'Business',
    type: 'Domain',
    count: 35
  }, {
    id: 3,
    name: 'Tutorial',
    type: 'Format',
    count: 28
  }, {
    id: 4,
    name: 'Case Study',
    type: 'Format',
    count: 15
  }, {
    id: 5,
    name: 'Beginner',
    type: 'Stage',
    count: 32
  }, {
    id: 6,
    name: 'Advanced',
    type: 'Stage',
    count: 24
  }, {
    id: 7,
    name: 'React',
    type: 'Tag',
    count: 19
  }, {
    id: 8,
    name: 'JavaScript',
    type: 'Tag',
    count: 27
  }]);
  const taxonomyTypes = ['All', 'Domain', 'Format', 'Stage', 'Tag'];
  const [activeType, setActiveType] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaxonomy, setNewTaxonomy] = useState({
    name: '',
    type: 'Tag'
  });
  const filteredTaxonomies = activeType === 'All' ? taxonomies : taxonomies.filter(tax => tax.type === activeType);
  const handleAddTaxonomy = () => {
    if (newTaxonomy.name.trim() === '') return;
    setTaxonomies([...taxonomies, {
      id: Math.max(...taxonomies.map(t => t.id)) + 1,
      name: newTaxonomy.name,
      type: newTaxonomy.type,
      count: 0
    }]);
    setNewTaxonomy({
      name: '',
      type: 'Tag'
    });
    setShowAddForm(false);
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          Taxonomy Management
        </h2>
        <button type="button" onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          {showAddForm ? 'Cancel' : 'Add Taxonomy'}
        </button>
      </div>
      {showAddForm && <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
          <h3 className="text-md font-medium text-blue-800 mb-3">
            Add New Taxonomy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tax-name" className="block text-sm font-medium text-gray-700 mb-1">
                Taxonomy Name
              </label>
              <input type="text" id="tax-name" value={newTaxonomy.name} onChange={e => setNewTaxonomy({
            ...newTaxonomy,
            name: e.target.value
          })} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter taxonomy name" />
            </div>
            <div>
              <label htmlFor="tax-type" className="block text-sm font-medium text-gray-700 mb-1">
                Taxonomy Type
              </label>
              <select id="tax-type" value={newTaxonomy.type} onChange={e => setNewTaxonomy({
            ...newTaxonomy,
            type: e.target.value
          })} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Domain">Domain</option>
                <option value="Format">Format</option>
                <option value="Stage">Stage</option>
                <option value="Tag">Tag</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={handleAddTaxonomy} className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add Taxonomy
            </button>
          </div>
        </div>}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex flex-wrap gap-2">
          {taxonomyTypes.map(type => <button key={type} className={`px-3 py-1 rounded-full text-sm font-medium ${activeType === type ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`} onClick={() => setActiveType(type)}>
              {type}
            </button>)}
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content Count
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTaxonomies.map(taxonomy => <tr key={taxonomy.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {taxonomy.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${taxonomy.type === 'Domain' ? 'bg-purple-100 text-purple-800' : taxonomy.type === 'Format' ? 'bg-green-100 text-green-800' : taxonomy.type === 'Stage' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                    {taxonomy.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {taxonomy.count} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
const RolesPermissionsTab: React.FC = () => {
  const [roles, setRoles] = useState([{
    id: 1,
    name: 'Admin',
    description: 'Full access to all features',
    userCount: 3,
    permissions: [{
      name: 'Content Management',
      access: 'Full'
    }, {
      name: 'User Management',
      access: 'Full'
    }, {
      name: 'Settings',
      access: 'Full'
    }, {
      name: 'Analytics',
      access: 'Full'
    }]
  }, {
    id: 2,
    name: 'Editor',
    description: 'Can create and edit content',
    userCount: 8,
    permissions: [{
      name: 'Content Management',
      access: 'Full'
    }, {
      name: 'User Management',
      access: 'View'
    }, {
      name: 'Settings',
      access: 'View'
    }, {
      name: 'Analytics',
      access: 'View'
    }]
  }, {
    id: 3,
    name: 'Reviewer',
    description: 'Can review and approve content',
    userCount: 5,
    permissions: [{
      name: 'Content Management',
      access: 'Review'
    }, {
      name: 'User Management',
      access: 'None'
    }, {
      name: 'Settings',
      access: 'None'
    }, {
      name: 'Analytics',
      access: 'View'
    }]
  }, {
    id: 4,
    name: 'Provider',
    description: 'Can submit content for review',
    userCount: 12,
    permissions: [{
      name: 'Content Management',
      access: 'Create'
    }, {
      name: 'User Management',
      access: 'None'
    }, {
      name: 'Settings',
      access: 'None'
    }, {
      name: 'Analytics',
      access: 'None'
    }]
  }]);
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const toggleRoleExpand = (roleId: number) => {
    setExpandedRole(expandedRole === roleId ? null : roleId);
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          Roles & Permissions
        </h2>
        <button type="button" className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add New Role
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {roles.map(role => <li key={role.id}>
              <div className={`px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-50 ${expandedRole === role.id ? 'bg-gray-50' : ''}`} onClick={() => toggleRoleExpand(role.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {role.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {role.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {role.userCount} users
                    </span>
                    <ChevronRightIcon className={`ml-2 h-5 w-5 text-gray-400 transform transition-transform ${expandedRole === role.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>
              {expandedRole === role.id && <div className="px-4 py-3 sm:px-6 bg-gray-50 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Permissions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {role.permissions.map((permission, idx) => <div key={idx} className="flex justify-between items-center">
                        <div className="text-sm text-gray-700">
                          {permission.name}
                        </div>
                        <div>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.access === 'Full' ? 'bg-green-100 text-green-800' : permission.access === 'View' ? 'bg-blue-100 text-blue-800' : permission.access === 'Review' ? 'bg-yellow-100 text-yellow-800' : permission.access === 'Create' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {permission.access}
                          </span>
                        </div>
                      </div>)}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button type="button" className="bg-white py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
                      Edit
                    </button>
                    <button type="button" className="bg-white py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Delete
                    </button>
                  </div>
                </div>}
            </li>)}
        </ul>
      </div>
    </div>;
};
const AssetsStorageTab: React.FC = () => {
  return <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Storage Configuration
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bucket-name" className="block text-sm font-medium text-gray-700 mb-1">
                Supabase Bucket Name
              </label>
              <input type="text" id="bucket-name" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="media-assets" />
            </div>
            <div>
              <label htmlFor="storage-region" className="block text-sm font-medium text-gray-700 mb-1">
                Storage Region
              </label>
              <select id="storage-region" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="us-west-1">
                <option value="us-west-1">US West (N. California)</option>
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="eu-west-1">EU (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          File Limitations
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="max-file-size" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum File Size (MB)
              </label>
              <input type="number" id="max-file-size" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="50" />
            </div>
            <div>
              <label htmlFor="storage-quota" className="block text-sm font-medium text-gray-700 mb-1">
                Storage Quota (GB)
              </label>
              <input type="number" id="storage-quota" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="100" />
            </div>
          </div>
          <div>
            <label htmlFor="allowed-file-types" className="block text-sm font-medium text-gray-700 mb-1">
              Allowed File Types
            </label>
            <div className="flex flex-wrap gap-2">
              {['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'mp3', 'mp4', 'avi'].map(type => <div key={type} className="flex items-center">
                  <input id={`file-type-${type}`} name="file-types" type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor={`file-type-${type}`} className="ml-2 text-sm text-gray-700">
                    .{type}
                  </label>
                </div>)}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Cleanup & Archive Settings
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <HardDriveIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Auto-Archive Unused Assets
                </h3>
                <p className="text-sm text-gray-500">
                  Automatically archive assets that haven't been used for the
                  specified period
                </p>
              </div>
            </div>
            <div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="unused-period" className="block text-sm font-medium text-gray-700 mb-1">
              Archive After (Days)
            </label>
            <input type="number" id="unused-period" className="block w-full max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="90" />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
          Cancel
        </button>
        <button type="button" className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Save Changes
        </button>
      </div>
    </div>;
};
const AuditSecurityTab: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState([{
    id: 1,
    action: 'Media Created',
    user: 'admin@example.com',
    timestamp: '2023-09-15 10:30:25',
    ip: '192.168.1.1',
    details: 'Created article "Getting Started Guide"'
  }, {
    id: 2,
    action: 'Media Updated',
    user: 'editor@example.com',
    timestamp: '2023-09-14 15:45:12',
    ip: '192.168.1.2',
    details: 'Updated article "Best Practices"'
  }, {
    id: 3,
    action: 'Media Published',
    user: 'admin@example.com',
    timestamp: '2023-09-13 09:20:18',
    ip: '192.168.1.1',
    details: 'Published article "New Features Announcement"'
  }, {
    id: 4,
    action: 'Login',
    user: 'reviewer@example.com',
    timestamp: '2023-09-12 14:10:05',
    ip: '192.168.1.3',
    details: 'User login successful'
  }, {
    id: 5,
    action: 'Media Archived',
    user: 'admin@example.com',
    timestamp: '2023-09-11 11:05:30',
    ip: '192.168.1.1',
    details: 'Archived article "Deprecated Features"'
  }]);
  return <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Audit Logs</h2>
        <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map(log => <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.action.includes('Created') ? 'bg-green-100 text-green-800' : log.action.includes('Updated') ? 'bg-blue-100 text-blue-800' : log.action.includes('Published') ? 'bg-purple-100 text-purple-800' : log.action.includes('Archived') ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.details}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Session Policies
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (Minutes)
              </label>
              <input type="number" id="session-timeout" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="60" />
            </div>
            <div>
              <label htmlFor="max-sessions" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Concurrent Sessions
              </label>
              <input type="number" id="max-sessions" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue="3" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <LockIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Enforce IP Restrictions
                </h3>
                <p className="text-sm text-gray-500">
                  Limit access to specific IP addresses or ranges
                </p>
              </div>
            </div>
            <div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          API Keys & Integrations
        </h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <KeySquareIcon className="h-5 w-5 text-gray-500" />
              <span className="ml-2 text-sm font-medium text-gray-900">
                Production API Key
              </span>
            </div>
            <div className="flex items-center">
              <input type="text" className="block w-64 border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm" value="••••••••••••••••••••••••••••••" readOnly />
              <button type="button" className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Reveal
              </button>
              <button type="button" className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Regenerate
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <KeySquareIcon className="h-5 w-5 text-gray-500" />
              <span className="ml-2 text-sm font-medium text-gray-900">
                Development API Key
              </span>
            </div>
            <div className="flex items-center">
              <input type="text" className="block w-64 border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm" value="••••••••••••••••••••••••••••••" readOnly />
              <button type="button" className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Reveal
              </button>
              <button type="button" className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
          Cancel
        </button>
        <button type="button" className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Save Changes
        </button>
      </div>
    </div>;
};
export default Settings;