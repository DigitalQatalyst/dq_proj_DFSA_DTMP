/**
 * User Invite Modal Component
 *
 * Modal for inviting new users to the system.
 * Includes form validation and accessibility features.
 *
 * @component
 * @example
 * ```tsx
 * <UserInviteModal
 *   roles={roles}
 *   onClose={handleClose}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
import React, { useEffect, useState, useRef, Component } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userInviteSchema } from '../utils/userValidation';
import { Role, UserInviteData } from '../types/user';
interface UserInviteModalProps {
  roles: Role[];
  onClose: () => void;
  onSubmit: (data: UserInviteData) => Promise<void>;
}
export default function UserInviteModal({
  roles,
  onClose,
  onSubmit
}: UserInviteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  // Form validation with React Hook Form and Yup
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<UserInviteData>({
    resolver: yupResolver(userInviteSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: ''
    }
  });
  // Handle form submission
  const onFormSubmit = async (data: UserInviteData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error is handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle click outside to close the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  // Handle escape key to close the modal
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
  // Set focus on first input when modal opens
  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, []);
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-md w-full" tabIndex={-1}>
        <div className="p-6">
          <h3 id="modal-title" className="text-lg font-medium text-gray-900 mb-4">
            Invite New User
          </h3>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input type="text" id="name" className={`mt-1 block w-full border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`} placeholder="Full Name" {...register('name')} ref={initialFocusRef} aria-invalid={errors.name ? 'true' : 'false'} aria-describedby={errors.name ? 'name-error' : undefined} />
              {errors.name && <p className="mt-1 text-sm text-red-600" id="name-error" role="alert">
                  {errors.name.message}
                </p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input type="email" id="email" className={`mt-1 block w-full border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`} placeholder="email@example.com" {...register('email')} aria-invalid={errors.email ? 'true' : 'false'} aria-describedby={errors.email ? 'email-error' : undefined} />
              {errors.email && <p className="mt-1 text-sm text-red-600" id="email-error" role="alert">
                  {errors.email.message}
                </p>}
            </div>
            <div>
              <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select id="roleId" className={`mt-1 block w-full border ${errors.roleId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`} {...register('roleId')} aria-invalid={errors.roleId ? 'true' : 'false'} aria-describedby={errors.roleId ? 'role-error' : undefined}>
                <option value="">Select a role</option>
                {roles.map(role => <option key={role.id} value={role.id.toString()}>
                    {role.name}
                  </option>)}
              </select>
              {errors.roleId && <p className="mt-1 text-sm text-red-600" id="role-error" role="alert">
                  {errors.roleId.message}
                </p>}
            </div>
          </form>
        </div>
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit(onFormSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>
      </div>
    </div>;
}