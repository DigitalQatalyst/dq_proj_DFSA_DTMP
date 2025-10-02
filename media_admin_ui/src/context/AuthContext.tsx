import React, { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';
export type UserRole = 'Admin' | 'Reviewer' | 'Editor' | 'Provider';
interface User {
  id: string;
  email: string;
  roles: UserRole[];
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const {
          data,
          error
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session) {
          // In a real app, you'd fetch user roles from Supabase
          // For now, we'll mock an admin user
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            roles: ['Admin']
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
    // Listen for auth changes
    const {
      data
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Mock user with roles
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          roles: ['Admin']
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      // Mock user roles - in a real app, you'd fetch these from your DB
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          roles: ['Admin']
        });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    return user.roles.some(role => requiredRoles.includes(role));
  };
  return <AuthContext.Provider value={{
    user,
    loading,
    signIn,
    signOut,
    hasPermission
  }}>
      {children}
    </AuthContext.Provider>;
};