import React from 'react';
import { GlobeIcon, ClockIcon, MoonIcon, BellIcon, ChevronDownIcon } from 'lucide-react';
export default function PreferencesNotificationsTab() {
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Preferences Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Preferences
          </h2>
          <div className="bg-white p-4 md:p-6 border border-gray-200 rounded-md space-y-4">
            {/* Language Preference */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GlobeIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                    Language
                  </label>
                  <select id="language" className="block w-full sm:max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Time Zone Preference */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                    Time Zone
                  </label>
                  <select id="timezone" className="block w-full sm:max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="gmt+4">(GMT+4) Gulf Standard Time</option>
                    <option value="gmt+3">(GMT+3) Eastern European Time</option>
                    <option value="gmt+0">(GMT+0) Greenwich Mean Time</option>
                    <option value="gmt-5">(GMT-5) Eastern Standard Time</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Dark Mode Toggle */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MoonIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      Dark Mode
                    </span>
                    <span className="text-sm text-gray-500">
                      Switch between light and dark theme
                    </span>
                  </div>
                  <div className="flex items-center">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Notifications Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Notifications
          </h2>
          <div className="bg-white p-4 md:p-6 border border-gray-200 rounded-md h-full">
            <p className="text-sm text-gray-500 mb-4">
              Configure which notifications you want to receive. These settings
              apply organization-wide.
            </p>
            <div className="space-y-4">
              {/* Compliance Alerts */}
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <BellIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Compliance Alerts
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Get notified about important compliance deadlines
                      </p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Submission Deadlines */}
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <BellIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Submission Deadlines
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Receive reminders about upcoming submissions
                      </p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Partner Messages */}
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <BellIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Partner Messages
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Get notified when partners send you messages
                      </p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Per-User Override Section (Coming Soon) */}
      <section className="opacity-50 cursor-not-allowed">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Per-User Notification Override
            </h2>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              Coming Soon
            </span>
          </div>
          <button className="md:hidden" onClick={() => {
          // Toggle the expandable section
          const section = document.getElementById('per-user-override-section');
          if (section) {
            section.classList.toggle('hidden');
          }
        }}>
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div id="per-user-override-section" className="hidden md:block">
          <div className="bg-white p-4 md:p-6 border border-gray-200 rounded-md">
            <p className="text-gray-500">
              Allow individual users to override organization-wide notification
              settings.
            </p>
          </div>
        </div>
      </section>
    </div>;
}