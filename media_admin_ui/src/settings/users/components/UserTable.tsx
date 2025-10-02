/**
 * User Table Component
 *
 * Displays users in a table format for desktop view.
 * Provides actions for editing, deleting, and managing user roles.
 *
 * @component
 * @example
 * ```tsx
 * <UserTable
 *   users={users}
 *   isLoading={isLoading}
 *   onDelete={handleDelete}
 *   onUpdateRole={handleUpdateRole}
 * />
 * ```
 */
import React, { memo, Component } from 'react';
import { PencilIcon, TrashIcon, KeyIcon } from 'lucide-react';
import { User } from '../types/user';
interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onDelete: (userId: number) => Promise<void>;
  onUpdateRole: (userId: number, roleId: number) => Promise<void>;
}
const UserTable = ({
  users,
  isLoading,
  onDelete,
  onUpdateRole
}: UserTableProps) => {
  if (isLoading) {
    return <div className="bg-white overflow-hidden border border-gray-200 rounded-md p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>;
  }
  return <div className="bg-white overflow-hidden border border-gray-200 rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.role}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.lastLogin}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3" aria-label={`Edit ${user.name}`}>
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 mr-3" aria-label={`Delete ${user.name}`} onClick={() => onDelete(user.id)}>
                  <TrashIcon className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900" aria-label={`Reset password for ${user.name}`}>
                  <KeyIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>;
};
export default memo(UserTable);