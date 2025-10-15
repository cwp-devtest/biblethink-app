/**
 * Firebase Storage Service
 * Handles all user data storage: read passages, notes, and progress tracking
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types
export interface ReadPassage {
  reference: string;
  readAt: Timestamp;
  notes?: string;
}

export interface UserProgress {
  totalPassagesRead: number;
  currentStreak: number;
  lastReadDate: string; // YYYY-MM-DD format
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Mark a passage as read
 */
export const markPassageAsRead = async (
  userId: string, 
  reference: string, 
  notes?: string
): Promise<void> => {
  try {
    const passageId = reference.replace(/[^a-zA-Z0-9]/g, '_'); // Convert to safe ID
    const passageRef = doc(db, 'users', userId, 'readPassages', passageId);
    
    await setDoc(passageRef, {
      reference,
      readAt: serverTimestamp(),
      notes: notes || '',
    });

    // Update user progress
    await updateUserProgress(userId);
  } catch (error) {
    console.error('Error marking passage as read:', error);
    throw error;
  }
};

/**
 * Check if a passage has been read
 */
export const isPassageRead = async (
  userId: string, 
  reference: string
): Promise<boolean> => {
  try {
    const passageId = reference.replace(/[^a-zA-Z0-9]/g, '_');
    const passageRef = doc(db, 'users', userId, 'readPassages', passageId);
    const passageSnap = await getDoc(passageRef);
    
    return passageSnap.exists();
  } catch (error) {
    console.error('Error checking if passage is read:', error);
    return false;
  }
};

/**
 * Get all read passages for a user
 */
export const getReadPassages = async (userId: string): Promise<ReadPassage[]> => {
  try {
    const passagesRef = collection(db, 'users', userId, 'readPassages');
    const querySnapshot = await getDocs(passagesRef);
    
    const passages: ReadPassage[] = [];
    querySnapshot.forEach((doc) => {
      passages.push(doc.data() as ReadPassage);
    });
    
    return passages;
  } catch (error) {
    console.error('Error getting read passages:', error);
    return [];
  }
};

/**
 * Get passages read this week
 */
export const getPassagesReadThisWeek = async (userId: string): Promise<number> => {
  try {
    // Get start of this week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);

    // Get all passages
    const passages = await getReadPassages(userId);
    
    // Filter passages read this week
    const passagesThisWeek = passages.filter(passage => {
      if (!passage.readAt) return false;
      
      // Convert Firestore Timestamp to Date
      const readDate = passage.readAt.toDate();
      return readDate >= monday;
    });
    
    return passagesThisWeek.length;
  } catch (error) {
    console.error('Error getting passages read this week:', error);
    return 0;
  }
};

/**
 * Get notes for a specific passage
 */
export const getPassageNotes = async (
  userId: string, 
  reference: string
): Promise<string> => {
  try {
    const passageId = reference.replace(/[^a-zA-Z0-9]/g, '_');
    const passageRef = doc(db, 'users', userId, 'readPassages', passageId);
    const passageSnap = await getDoc(passageRef);
    
    if (passageSnap.exists()) {
      return passageSnap.data().notes || '';
    }
    return '';
  } catch (error) {
    console.error('Error getting passage notes:', error);
    return '';
  }
};

/**
 * Update notes for a passage
 */
export const updatePassageNotes = async (
  userId: string, 
  reference: string, 
  notes: string
): Promise<void> => {
  try {
    const passageId = reference.replace(/[^a-zA-Z0-9]/g, '_');
    const passageRef = doc(db, 'users', userId, 'readPassages', passageId);
    
    await updateDoc(passageRef, {
      notes,
    });
  } catch (error) {
    console.error('Error updating passage notes:', error);
    throw error;
  }
};

/**
 * Update user progress (total read, streak)
 */
const updateUserProgress = async (userId: string): Promise<void> => {
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'stats');
    const progressSnap = await getDoc(progressRef);
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (progressSnap.exists()) {
      const data = progressSnap.data() as UserProgress;
      const lastReadDate = data.lastReadDate;
      
      // Calculate streak
      let newStreak = data.currentStreak;
      if (lastReadDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastReadDate === yesterdayStr) {
          // Continue streak
          newStreak += 1;
        } else {
          // Streak broken
          newStreak = 1;
        }
      }
      
      await updateDoc(progressRef, {
        totalPassagesRead: data.totalPassagesRead + 1,
        currentStreak: newStreak,
        lastReadDate: today,
        updatedAt: serverTimestamp(),
      });
    } else {
      // First passage read
      await setDoc(progressRef, {
        totalPassagesRead: 1,
        currentStreak: 1,
        lastReadDate: today,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

/**
 * Get user progress
 */
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'stats');
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return progressSnap.data() as UserProgress;
    }
    return null;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
};

/**
 * Get a random unread passage reference
 * Finds passages the user hasn't read yet
 */
export const getRandomUnreadPassage = async (userId: string): Promise<string | null> => {
  try {
    // Import bibleService dynamically to avoid circular dependencies
    const { bibleService } = await import('./bibleService');
    
    // Get all read passage references
    const readPassages = await getReadPassages(userId);
    const readReferences = new Set(readPassages.map(p => p.reference));
    
    console.log(`User has read ${readReferences.size} passages`);
    
    // Try to find an unread passage (max 50 attempts)
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      const randomPassage = await bibleService.getRandomPassage(5);
      
      if (randomPassage && !readReferences.has(randomPassage.reference)) {
        console.log(`Found unread passage: ${randomPassage.reference}`);
        return randomPassage.reference;
      }
      
      attempts++;
    }
    
    // If we've read too many, just return any random passage
    console.log('Could not find unread passage after 50 attempts, returning random');
    const fallbackPassage = await bibleService.getRandomPassage(5);
    return fallbackPassage?.reference || null;
    
  } catch (error) {
    console.error('Error getting random unread passage:', error);
    return null;
  }
};

/**
 * Get count of unread passages
 * Returns approximate count of unseen passages
 */
export const getUnreadPassagesCount = async (userId: string): Promise<number> => {
  try {
    const readPassages = await getReadPassages(userId);
    
    // Bible has approximately 31,102 verses
    // If we consider 5-verse passages, that's ~6,220 possible passages
    // This is approximate since passages can overlap
    const approximateTotalPassages = 6220;
    const readCount = readPassages.length;
    
    return Math.max(0, approximateTotalPassages - readCount);
  } catch (error) {
    console.error('Error getting unread passages count:', error);
    return 0;
  }
};
