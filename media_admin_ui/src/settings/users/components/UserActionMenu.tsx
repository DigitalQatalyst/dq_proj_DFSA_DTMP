/**
 * User Action Menu Component
 *
 * Dropdown menu for user actions in mobile view.
 *
 * @component
 * @example
 * ```tsx
 * <UserActionMenu
 *   user={user}
 *   onClose={handleClose}
 *   onDelete={handleDelete}
 * />
 * ```
 */
import React, { useEffect, useRef, Component } from 'react';
import { PencilIcon, TrashIcon, KeyIcon } from 'lucide-react';
import { User } from '../types/user';
interface UserActionMenuProps {
  user: User;
  onClose: () => void;
  onDelete: () => void;
}
export default function UserActionMenu({
  user,
  onClose,
  onDelete
}: UserActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  // Handle click inside to prevent closing
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  // Handle escape key to close the menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  // Set focus on first button when menu opens
  useEffect(() => {
    const firstButton = menuRef.current?.querySelector('button');
    if (firstButton) {
      firstButton.focus();
    }
  }, []);
  return <div ref={menuRef} className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200" role="menu" aria-orientation="vertical" aria-labelledby={`user-menu-${user.id}`} onClick={handleMenuClick}>
      <div className="py-1">
        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem" tabIndex={0}>
          <PencilIcon className="h-4 w-4 mr-2 text-blue-600" />
          Edit User
        </button>
        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem" onClick={onDelete} tabIndex={0}>
          <TrashIcon className="h-4 w-4 mr-2 text-red-600" />
          Delete User
        </button>
        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem" tabIndex={0}>
          <KeyIcon className="h-4 w-4 mr-2 text-gray-600" />
          Reset Password
        </button>
      </div>
    </div>;
}