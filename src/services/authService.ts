/**
 * Firebase Authentication Service
 * Handles user authentication (sign up, sign in, sign out)
 */

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  signInAnonymously as firebaseSignInAnonymously
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign in anonymously (great for testing!)
 */
export const signInAnonymously = async (): Promise<User> => {
  try {
    const userCredential = await firebaseSignInAnonymously(auth);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in anonymously:', error);
    throw new Error(error.message || 'Failed to sign in anonymously');
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
