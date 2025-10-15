/**
 * Auth Context - Manages user authentication state
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  onAuthChange, 
  signInAnonymously as firebaseSignInAnonymously,
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signOut as firebaseSignOut
} from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInAnonymously = async () => {
    try {
      await firebaseSignInAnonymously();
    } catch (error) {
      console.error('Failed to sign in anonymously:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await firebaseSignIn(email, password);
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await firebaseSignUp(email, password);
    } catch (error) {
      console.error('Failed to sign up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInAnonymously, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
