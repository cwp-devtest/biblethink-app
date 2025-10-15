/**
 * Firebase Configuration and Initialization
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgCla8D00lAc067K8GXS-qj_VmdyT1QPo",
  authDomain: "biblethink-8dcac.firebaseapp.com",
  projectId: "biblethink-8dcac",
  storageBucket: "biblethink-8dcac.firebasestorage.app",
  messagingSenderId: "781536272789",
  appId: "1:781536272789:web:754b790f98bd9b8746169c",
  measurementId: "G-11925KMN90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
