/**
 * Roles Permissions List Component
 *
 * Displays and manages roles and their permissions.
 *
 * @component
 * @example
 * ```tsx
 * <RolesPermissionsList
 *   roles={roles}
 *   expandedRoleId={expandedRoleId}
 *   toggleRoleExpand={toggleRoleExpand}
 * />
 * ```
 */
import React, { memo, Component } from 'react';
import { ChevronUpIcon, ChevronDownIcon, PlusIcon } from 'lucide-react';
import { Role } from '../types/user';
interface RolesPermissionsListProps {
  roles: Role[];
  expandedRoleId: number | null;
  toggleRoleExpand: (roleId: number) => void;
}
function RolesPermissionsList({
  roles,
  expandedRoleId,
  toggleRoleExpand
}: RolesPermissionsListProps) {
  return <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Roles & Permissions
        </h2>
        <button className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="Create New Role">
          <PlusIcon className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Create New Role</span>
          <span className="sm:hidden">New Role</span>
        </button>
      </div>
      <div className="space-y-3">
        {roles.map(role => <div key={role.id} className="border border-gray-200 rounded-md bg-white overflow-hidden">
            <div className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={() => toggleRoleExpand(role.id)} aria-expanded={expandedRoleId === role.id} aria-controls={`role-permissions-${role.id}`}>
              <div>
                <h3 className="text-md font-medium text-gray-900">
                  {role.name}
                </h3>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
              <div>
                {expandedRoleId === role.id ? <ChevronUpIcon className="h-5 w-5 text-gray-500" aria-hidden="true" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />}
              </div>
            </div>
            {expandedRoleId === role.id && <div className="px-4 py-3 bg-gray-50 border-t border-gray-200" id={`role-permissions-${role.id}`}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Permissions:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {role.permissions.map((permission, index) => <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{permission.name}:</span>
                      <span className={`font-medium ${permission.access === 'Full' ? 'text-green-600' : permission.access === 'View Only' ? 'text-blue-600' : 'text-red-600'}`}>
                        {permission.access}
                      </span>
                    </div>)}
                </div>
              </div>}
          </div>)}
      </div>
    </section>;
}
export default memo(RolesPermissionsList);