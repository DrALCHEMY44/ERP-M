
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { getUserByEmail, createUser } from '@/lib/data-service';

export interface AppUser {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  businessId: string;
  fullName?: string | null;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: AppUser | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (firebaseUser: FirebaseUser) => {
    if (!firebaseUser.email) {
      setProfile(null);
      return;
    }

    try {
      let appUser = await getUserByEmail(firebaseUser.email);
      if (!appUser) {
        console.log('User profile not found in SQL Connect. Checking Firestore for auto-migration...');
        const userDocSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          console.log('Found Firestore user profile. Migrating to SQL Connect:', data);
          const tenantId = data.tenantId || "";
          const businessId = data.businessId || "";
          if (tenantId && businessId) {
            await createUser({
              tenantId,
              businessId,
              email: firebaseUser.email,
              role: data.role || "Business Owner",
              fullName: data.fullName || "",
            });
            console.log('Successfully created migrated user in SQL Connect.');
            appUser = await getUserByEmail(firebaseUser.email);
          } else {
            console.warn('Firestore user profile found but tenantId/businessId is missing:', data);
          }
        } else {
          console.warn('No user profile found in Firestore for UID:', firebaseUser.uid);
        }
      }
      setProfile(appUser);
    } catch (e) {
      console.error('Failed to fetch user profile:', e);
      setProfile(null);
    }
  };

  const refetchProfile = async () => {
    if (auth.currentUser) {
      setLoading(true);
      await fetchProfile(auth.currentUser);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        setLoading(true);
        await fetchProfile(firebaseUser);
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refetchProfile }}>
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
