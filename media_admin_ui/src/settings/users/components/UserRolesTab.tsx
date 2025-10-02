/**
 * User Roles Tab Component
 *
 * Main component for the Users & Roles tab in the Settings page.
 * Manages users, roles, and permissions.
 *
 * @component
 * @example
 * ```tsx
 * <UserRolesTab />
 * ```
 */
import React, { useState, memo, Component } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PlusIcon } from 'lucide-react';
import UserTable from './UserTable';
import UserCard from './UserCard';
import UserInviteModal from './UserInviteModal';
import RolesPermissionsList from './RolesPermissionsList';
import ExternalIdentitiesSection from './ExternalIdentitiesSection';
import ErrorFallback from '../../components/ErrorBoundary';
import { useUsers } from '../hooks/useUsers';
import { useUserMutations } from '../hooks/useUserMutations';
import { User, Role } from '../types/user';
const UserRolesTab = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [expandedRoleId, setExpandedRoleId] = useState<number | null>(null);
  const {
    users,
    roles,
    isLoading,
    error,
    refetch
  } = useUsers();
  const {
    inviteUser,
    deleteUser,
    updateUserRole
  } = useUserMutations();
  // Toggle role expansion
  const toggleRoleExpand = (roleId: number) => {
    setExpandedRoleId(expandedRoleId === roleId ? null : roleId);
  };
  // Handle user invitation
  const handleInviteUser = async (userData: any) => {
    try {
      await inviteUser(userData);
      setShowUserModal(false);
      refetch();
    } catch (error) {
      console.error('Error inviting user:', error);
      // Error would be handled by the form component
    }
  };
  if (error) {
    return <div className="text-red-500">Error loading users: {error.message}</div>;
  }
  return <div className="space-y-6">
      {/* User Management Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            User Management
          </h2>
          <button onClick={() => setShowUserModal(true)} className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="Invite New User">
            <PlusIcon className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Invite New User</span>
            <span className="sm:hidden">Invite</span>
          </button>
        </div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <UserTable users={users} isLoading={isLoading} onDelete={deleteUser} onUpdateRole={updateUserRole} />
          </div>
          {/* Mobile Card View */}
          <div className="md:hidden">
            <UserCard users={users} isLoading={isLoading} onDelete={deleteUser} onUpdateRole={updateUserRole} />
          </div>
        </ErrorBoundary>
      </section>
      {/* Roles & Permissions Section */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <RolesPermissionsList roles={roles} expandedRoleId={expandedRoleId} toggleRoleExpand={toggleRoleExpand} />
      </ErrorBoundary>
      {/* External Identities & SSO Section (Coming Soon) */}
      <ExternalIdentitiesSection expandedRoleId={expandedRoleId} toggleRoleExpand={toggleRoleExpand} />
      {/* User Invite Modal */}
      {showUserModal && <UserInviteModal roles={roles} onClose={() => setShowUserModal(false)} onSubmit={handleInviteUser} />}
    </div>;
};
export default memo(UserRolesTab);