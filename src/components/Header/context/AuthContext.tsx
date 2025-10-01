import React, { useEffect, useMemo, useState, createContext, useContext, useCallback, ReactNode } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { EventType, AuthenticationResult } from '@azure/msal-browser';
import { defaultLoginRequest, signupRequest } from '../../../services/auth/msal';

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
  signup: () => void;
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
  const [emailOverride, setEmailOverride] = useState<string | undefined>(undefined);
  const viteEnv = (import.meta as any).env as Record<string, string | undefined>;
  const enableGraphFallback = (viteEnv?.VITE_MSAL_ENABLE_GRAPH_FALLBACK || viteEnv?.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === 'true';

  // Ensure active account is set for convenience
  useEffect(() => {
    const active = instance.getActiveAccount();
    if (!active && accounts.length === 1) {
      instance.setActiveAccount(accounts[0]);
    }
  }, [instance, accounts]);

  // Ensure active account is set on successful login/redirect events
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS
      ) {
        const payload = event.payload as AuthenticationResult | null;
        const account = payload?.account;
        if (account) {
          instance.setActiveAccount(account);
          // Log Entra token claims on successful auth/token events
          const claims = (payload as any)?.idTokenClaims || (account as any)?.idTokenClaims;
          if (claims) {
            try {
              // Collapsed group to keep console tidy
              console.groupCollapsed('[Auth] Entra ID token claims');
              console.log(claims);
              console.groupEnd();
            } catch {
              console.log('[Auth] Entra ID token claims:', claims);
            }
          }
        }
      }
    });
    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance]);

  // Also log claims when an active account is present (e.g., on reload)
  useEffect(() => {
    const account = instance.getActiveAccount() || accounts[0];
    const claims = (account as any)?.idTokenClaims;
    if (claims) {
      try {
        console.groupCollapsed('[Auth] Entra ID token claims (initial)');
        console.log(claims);
        console.groupEnd();
      } catch {
        console.log('[Auth] Entra ID token claims (initial):', claims);
      }
    }
  }, [instance, accounts]);

  const user: UserProfile | null = useMemo(() => {
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return null;
    const claims = account.idTokenClaims as any;
    const name = account.name || claims?.name || '';
    // Prefer real email claims over UPN/preferred_username when available
    const email =
      claims?.emails?.[0] ||
      claims?.email ||
      claims?.preferred_username ||
      account.username ||
      '';
    return {
      id: account.localAccountId,
      name,
      email: emailOverride || email,
      givenName: claims?.given_name,
      familyName: claims?.family_name,
      picture: undefined
    };
  }, [accounts, instance, emailOverride]);

  useEffect(() => {
    // Loading is complete once we have determined authentication state at least once
    setIsLoading(false);
  }, [isAuthenticated]);

  // Heuristic to detect synthetic/UPN-like emails we want to improve
  const looksSynthetic = useCallback((value?: string) => {
    if (!value) return true;
    const onMs = /@.*\.onmicrosoft\.com$/i.test(value);
    const guidLocal = /^[0-9a-f-]{36}@/i.test(value) || value.includes('#EXT#');
    return onMs || guidLocal;
  }, []);

  // Optional: resolve better email via Microsoft Graph if configured and necessary
  useEffect(() => {
    if (!enableGraphFallback) return;
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return;
    const claims = account.idTokenClaims as any;
    const current = (claims?.emails?.[0] || claims?.email || claims?.preferred_username || account.username) as string | undefined;
    if (current && !looksSynthetic(current)) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await instance.acquireTokenSilent({
          account,
          scopes: ['User.Read']
        });
        const r = await fetch('https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName,otherMails', {
          headers: { Authorization: `Bearer ${result.accessToken}` }
        });
        if (!r.ok) return;
        const me = await r.json();
        const resolved: string | undefined = me.mail || (me.otherMails && me.otherMails[0]) || me.userPrincipalName || current;
        if (!cancelled && resolved && !looksSynthetic(resolved)) {
          setEmailOverride(resolved);
        }
      } catch (e) {
        // ignore failures silently; fallback remains
      }
    })();
    return () => { cancelled = true; };
  }, [accounts, instance, enableGraphFallback, looksSynthetic]);

  const login = useCallback(() => {
    instance.loginRedirect({
      ...defaultLoginRequest
    });
  }, [instance]);

  // For B2C with a combined SUSI policy, signup is the same as login
  const signup = useCallback(() => {
    instance.loginRedirect({
      ...signupRequest,
      // Tag this flow so we can route to onboarding after redirect
      state: 'ej-signup'
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
    signup,
    logout
  }), [user, isLoading, login, signup, logout]);

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
