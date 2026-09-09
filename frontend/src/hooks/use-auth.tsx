
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { authClient } from '@/lib/auth/client';
import { recoverAuthenticationSession } from '@/lib/auth/session-recovery';

export interface AppUser {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  businessId: string;
  fullName?: string | null;
  businessCode?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: AppUser | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
}

export interface AuthUser {
  id: string;
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileResolved, setProfileResolved] = useState(false);
  const session = authClient.useSession();

  const user = useMemo<AuthUser | null>(() => {
    const identity = session.data?.user;
    if (identity) return {
      id: identity.id,
      uid: identity.id,
      email: identity.email,
      displayName: identity.name || null,
      photoURL: identity.image || null,
      emailVerified: Boolean(identity.emailVerified),
    };
    if (!profile) return null;
    return {
      id: profile.id,
      uid: profile.id,
      email: profile.email,
      displayName: profile.fullName || null,
      photoURL: null,
      emailVerified: false,
    };
  }, [profile, session.data?.user]);

  const fetchProfile = useCallback(async (): Promise<"resolved" | "retry"> => {
    try {
      const response = await fetch('/api/profile', { cache: 'no-store' });
      const body = await response.json();
      if (response.status === 404) {
        setProfile(null);
        setProfileResolved(true);
        return "resolved";
      }
      if (response.status === 401 || response.status === 403) {
        setProfile(null);
        setProfileResolved(true);
        if (session.data?.user) await recoverAuthenticationSession();
        return "resolved";
      }
      if (response.status === 503) return "retry";
      if (!response.ok) throw new Error(body.error || 'Profile lookup failed');
      setProfile(body.user);
      setProfileResolved(true);
      return "resolved";
    } catch (e) {
      console.error('Failed to fetch user profile:', e);
      // A temporary database/network failure must not erase a valid session or
      // redirect an authenticated user into registration. The effect retries.
      return "retry";
    }
  }, [session.data?.user]);

  const refetchProfile = useCallback(async () => {
    await session.refetch();
    setProfileLoading(true);
    await fetchProfile();
    setProfileLoading(false);
  }, [fetchProfile, session]);

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;
    const load = async () => {
      setProfileLoading(true);
      const result = await fetchProfile();
      if (!active) return;
      setProfileLoading(false);
      if (result === "retry") {
        const delay = Math.min(30_000, 1_000 * 2 ** attempt);
        attempt += 1;
        retryTimer = setTimeout(() => { void load(); }, delay);
      }
    };
    setProfileResolved(false);
    void load();
    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [fetchProfile, session.data?.user?.id]);

  return (
    <AuthContext.Provider value={{ user, profile, loading: session.isPending || profileLoading || !profileResolved, refetchProfile }}>
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
