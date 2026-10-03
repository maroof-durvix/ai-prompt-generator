'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

interface UserProfile {
  email: string;
  plan: string;
  credits: number;
  onboarded: boolean;
  role?: string;
  goal?: string;
  model?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Sync custom user profile from Firestore in real-time
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // Listen to Firestore profile updates
        const unsubscribeProfile = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create user document if it does not exist (migrating localstorage if available)
            let savedCredits = 3;
            let plan = 'free';
            let role = '';
            let goal = '';
            let model = '';
            let onboarded = false;

            if (typeof window !== 'undefined') {
              plan = localStorage.getItem('yp-plan') || 'free';
              savedCredits = Number(localStorage.getItem('yp-free-credits') || '3');
              role = localStorage.getItem('yp-user-role') || '';
              goal = localStorage.getItem('yp-user-goal') || '';
              model = localStorage.getItem('yp-user-model') || '';
              onboarded = localStorage.getItem('yp-onboarded') === 'true';
            }

            const initialProfile: UserProfile = {
              email: currentUser.email || '',
              plan,
              credits: savedCredits,
              onboarded,
              role,
              goal,
              model,
            };

            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          }
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, data, { merge: true });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
