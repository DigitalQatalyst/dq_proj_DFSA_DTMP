import React, { useEffect, useState } from 'react';
import { ShieldIcon, LaptopIcon, ClockIcon, ExternalLinkIcon, ChevronDownIcon, ChevronUpIcon, MoreVerticalIcon } from 'lucide-react';
// Mock data for connected devices
const mockDevices = [{
  id: 1,
  name: 'Windows 11 - Chrome',
  location: 'Dubai, UAE',
  lastActive: '2 minutes ago',
  isCurrent: true
}, {
  id: 2,
  name: 'MacBook Pro - Safari',
  location: 'Dubai, UAE',
  lastActive: '2 days ago',
  isCurrent: false
}, {
  id: 3,
  name: 'iPhone 13 - Mobile Safari',
  location: 'Abu Dhabi, UAE',
  lastActive: '5 days ago',
  isCurrent: false
}];
export default function SecurityComplianceTab() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };
  const toggleActionMenu = (deviceId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === deviceId ? null : deviceId);
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
      {/* Security & Access Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Security & Access
          </h2>
          <button className="md:hidden" onClick={() => toggleSection('security')}>
            {expandedSection === 'security' ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
        <div className={`space-y-4 ${expandedSection === 'security' || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}`}>
          {/* Password Reset Link */}
          <div className="bg-white p-4 md:p-6 border border-gray-200 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <ShieldIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Password Management
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Reset your password or manage your security settings
                    </p>
                    <div className="mt-3">
                      <a href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                        Reset password with Azure External ID
                        <ExternalLinkIcon className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Connected Devices - Greyed Out */}
          <div className="bg-white p-4 md:p-6 border border-gray-200 rounded-md opacity-50 cursor-not-allowed">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Connected Devices
                </h3>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Coming Soon
                </span>
              </div>
            </div>
            {/* Desktop view for devices */}
            <div className="hidden md:block space-y-3">
              {mockDevices.map(device => <div key={device.id} className="flex items-start p-3 border border-gray-100 rounded-md bg-gray-50">
                  <div className="flex-shrink-0 mt-0.5">
                    <LaptopIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-gray-900">
                            {device.name}
                          </h4>
                          {device.isCurrent && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Current
                            </span>}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>{device.location}</span>
                          <span className="mx-1">•</span>
                          <span className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {device.lastActive}
                          </span>
                        </div>
                      </div>
                      {!device.isCurrent && <button className="text-xs text-red-600 hover:text-red-800">
                          Revoke Access
                        </button>}
                    </div>
                  </div>
                </div>)}
            </div>
            {/* Mobile view for devices */}
            <div className="md:hidden space-y-3">
              {mockDevices.map(device => <div key={device.id} className="flex items-start p-3 border border-gray-100 rounded-md bg-gray-50">
                  <div className="flex-shrink-0 mt-0.5">
                    <LaptopIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {device.name}
                          </h4>
                          {device.isCurrent && <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Current
                            </span>}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          <div>{device.location}</div>
                          <div className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {device.lastActive}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button onClick={e => toggleActionMenu(device.id, e)} className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none" disabled={device.isCurrent}>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </button>
                        {openActionMenuId === device.id && <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button className="flex items-center px-4 py-2 text-sm text-red-600 w-full text-left">
                                Revoke Access
                              </button>
                            </div>
                          </div>}
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </section>
      {/* Audit & Activity Logs Section (Coming Soon) */}
      <section className="opacity-50 cursor-not-allowed">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Audit & Activity Logs
            </h2>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              Coming Soon
            </span>
          </div>
          <button className="md:hidden" onClick={() => toggleSection('audit')}>
            {expandedSection === 'audit' ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
        <div className={`${expandedSection === 'audit' || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 md:p-6 border border-gray-200 rounded-md">
            <p className="text-gray-500">
              Track user activities and system events for security and
              compliance purposes.
            </p>
          </div>
        </div>
      </section>
      {/* Data Management & Compliance Section (Coming Soon) */}
      <section className="opacity-50 cursor-not-allowed">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Management & Compliance
            </h2>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              Coming Soon
            </span>
          </div>
          <button className="md:hidden" onClick={() => toggleSection('data')}>
            {expandedSection === 'data' ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
        <div className={`${expandedSection === 'data' || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 md:p-6 border border-gray-200 rounded-md">
            <p className="text-gray-500">
              Manage data retention policies, data export, and compliance
              settings.
            </p>
          </div>
        </div>
      </section>
    </div>;
}