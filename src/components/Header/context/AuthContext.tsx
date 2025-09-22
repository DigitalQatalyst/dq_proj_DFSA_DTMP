import React, { useEffect, useMemo, useState, createContext, useContext, useCallback } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { defaultLoginRequest } from '../../../services/auth/msal';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);

  // Ensure active account is set for convenience
  useEffect(() => {
    const active = instance.getActiveAccount();
    if (!active && accounts.length === 1) {
      instance.setActiveAccount(accounts[0]);
    }
  }, [instance, accounts]);

  const user: UserProfile | null = useMemo(() => {
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return null;
    const claims = account.idTokenClaims as any;
    const name = account.name || claims?.name || '';
    const email = account.username || claims?.preferred_username || claims?.emails?.[0] || '';
    return {
      id: account.localAccountId,
      name,
      email,
      givenName: claims?.given_name,
      familyName: claims?.family_name,
      picture: undefined
    };
  }, [accounts, instance]);

  useEffect(() => {
    // Loading is complete once we have determined authentication state at least once
    setIsLoading(false);
  }, [isAuthenticated]);

  const login = useCallback(() => {
    instance.loginRedirect({
      ...defaultLoginRequest
    });
  }, [instance]);

  const logout = useCallback(() => {
    const account = instance.getActiveAccount() || accounts[0];
    instance.logoutRedirect({ account: account });
  }, [instance, accounts]);

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    login,
    logout
  }), [user, isLoading, login, logout]);

  return <AuthContext.Provider value={contextValue}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}