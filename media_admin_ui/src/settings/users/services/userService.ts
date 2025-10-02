/**
 * User Service
 *
 * Business logic and mock data for user management.
 */
import { User, Role } from '../types/user';
// Mock data for users
export const mockUsers: User[] = [{
  id: 1,
  name: 'Ahmed Al Mansoori',
  email: 'ahmed@example.com',
  role: 'Admin',
  status: 'Active',
  lastLogin: '2023-09-15 10:30 AM'
}, {
  id: 2,
  name: 'Fatima Al Hashimi',
  email: 'fatima@example.com',
  role: 'Editor',
  status: 'Active',
  lastLogin: '2023-09-14 02:15 PM'
}, {
  id: 3,
  name: 'Mohammed Al Qasimi',
  email: 'mohammed@example.com',
  role: 'Viewer',
  status: 'Inactive',
  lastLogin: '2023-08-30 09:45 AM'
}, {
  id: 4,
  name: 'Aisha Al Zaabi',
  email: 'aisha@example.com',
  role: 'Admin',
  status: 'Active',
  lastLogin: '2023-09-15 08:20 AM'
}, {
  id: 5,
  name: 'Omar Al Suwaidi',
  email: 'omar@example.com',
  role: 'Editor',
  status: 'Active',
  lastLogin: '2023-09-13 04:30 PM'
}, {
  id: 6,
  name: 'Sara Al Farsi',
  email: 'sara@example.com',
  role: 'Advisor',
  status: 'Active',
  lastLogin: '2023-09-12 01:45 PM'
}];
// Mock data for roles
export const mockRoles: Role[] = [{
  id: 1,
  name: 'Admin',
  description: 'Full access to all features',
  permissions: [{
    name: 'User Management',
    access: 'Full'
  }, {
    name: 'Content Management',
    access: 'Full'
  }, {
    name: 'Settings',
    access: 'Full'
  }, {
    name: 'Reports',
    access: 'Full'
  }]
}, {
  id: 2,
  name: 'Editor',
  description: 'Can edit content but cannot manage users',
  permissions: [{
    name: 'User Management',
    access: 'View Only'
  }, {
    name: 'Content Management',
    access: 'Full'
  }, {
    name: 'Settings',
    access: 'View Only'
  }, {
    name: 'Reports',
    access: 'Full'
  }]
}, {
  id: 3,
  name: 'Viewer',
  description: 'View-only access to content',
  permissions: [{
    name: 'User Management',
    access: 'None'
  }, {
    name: 'Content Management',
    access: 'View Only'
  }, {
    name: 'Settings',
    access: 'None'
  }, {
    name: 'Reports',
    access: 'View Only'
  }]
}, {
  id: 4,
  name: 'Advisor',
  description: 'Can provide advice and recommendations',
  permissions: [{
    name: 'User Management',
    access: 'None'
  }, {
    name: 'Content Management',
    access: 'View Only'
  }, {
    name: 'Settings',
    access: 'None'
  }, {
    name: 'Reports',
    access: 'Full'
  }]
}];
/**
 * Validates an email address
 *
 * @param email Email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
/**
 * Checks if a user with the given email already exists
 *
 * @param email Email to check
 * @returns Whether the email is already in use
 */
export function isEmailInUse(email: string): boolean {
  return mockUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}