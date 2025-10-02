/**
 * User Card Component
 *
 * Displays users in a card format for mobile view.
 * Provides actions for managing users via a dropdown menu.
 *
 * @component
 * @example
 * ```tsx
 * <UserCard
 *   users={users}
 *   isLoading={isLoading}
 *   onDelete={handleDelete}
 *   onUpdateRole={handleUpdateRole}
 * />
 * ```
 */
import React, { useEffect, useState, useRef, memo, Component } from 'react';
import { MoreVerticalIcon } from 'lucide-react';
import UserActionMenu from './UserActionMenu';
import { User } from '../types/user';
interface UserCardProps {
  users: User[];
  isLoading: boolean;
  onDelete: (userId: number) => Promise<void>;
  onUpdateRole: (userId: number, roleId: number) => Promise<void>;
}
const UserCard = ({
  users,
  isLoading,
  onDelete,
  onUpdateRole
}: UserCardProps) => {
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
  const toggleActionMenu = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === userId ? null : userId);
  };
  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside any action menu
      if (openActionMenuId !== null) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionMenuId]);
  if (isLoading) {
    return <div className="space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="bg-white border border-gray-200 rounded-md p-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>)}
      </div>;
  }
  return <div className="space-y-3">
      {users.map(user => <div key={user.id} className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {user.name}
                </h3>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
              <div className="relative">
                <button onClick={e => toggleActionMenu(user.id, e)} className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" aria-label={`Actions for ${user.name}`} aria-expanded={openActionMenuId === user.id} aria-haspopup="true">
                  <MoreVerticalIcon className="h-5 w-5" />
                </button>
                {/* Action Menu */}
                {openActionMenuId === user.id && <UserActionMenu user={user} onClose={() => setOpenActionMenuId(null)} onDelete={() => {
              onDelete(user.id);
              setOpenActionMenuId(null);
            }} />}
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Status:</span>{' '}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.status}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Last Login:</span>{' '}
                {user.lastLogin}
              </p>
            </div>
          </div>
        </div>)}
    </div>;
};
export default memo(UserCard);