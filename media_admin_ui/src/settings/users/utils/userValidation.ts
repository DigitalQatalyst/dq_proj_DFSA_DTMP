/**
 * User Validation Utilities
 *
 * Provides validation schemas and utilities for user-related forms.
 */
import * as yup from 'yup';
/**
 * Validation schema for user invitation form
 */
export const userInviteSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: yup.string().required('Email is required').email('Must be a valid email address').lowercase(),
  roleId: yup.string().required('Role selection is required')
});
/**
 * Validation schema for role creation form
 */
export const roleCreateSchema = yup.object({
  name: yup.string().required('Role name is required').min(2, 'Role name must be at least 2 characters').max(30, 'Role name must be less than 30 characters'),
  description: yup.string().required('Description is required').max(100, 'Description must be less than 100 characters'),
  permissions: yup.array().of(yup.object({
    name: yup.string().required('Permission name is required'),
    access: yup.string().oneOf(['Full', 'View Only', 'None'], 'Invalid access level').required('Access level is required')
  })).min(1, 'At least one permission must be defined')
});
/**
 * Validates a password against security requirements
 *
 * @param password Password to validate
 * @returns Validation result with success flag and message
 */
export function validatePassword(password: string): {
  valid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters'
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number'
    };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character'
    };
  }
  return {
    valid: true,
    message: 'Password is valid'
  };
}