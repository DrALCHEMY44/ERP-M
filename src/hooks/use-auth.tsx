
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      // Unblock auth-dependent queries immediately once Firebase user resolves
      setLoading(false);

      if (firebaseUser && firebaseUser.email) {
        // Profile fetch happens in parallel — doesn't block page data queries
        setProfileLoading(true);
        try {
          const appUser = await getUserByEmail(firebaseUser.email);
          setProfile(appUser);
        } catch (e) {
          console.error('Failed to fetch user profile:', e);
          setProfile(null);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
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
