import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface UseDataConnectOptions<T, V> {
  query: any; // Using any to avoid overload resolution issues with DataConnect queries
  variables?: V;
  skip?: boolean;
  refreshInterval?: number; // Time in milliseconds to poll the database
}

/**
 * A React hook to fetch data using Firebase Data Connect SDK queries.
 * Handles loading states, errors, and provides a `refetch` function.
 * Returns `unauthenticated: true` when the user is not signed in,
 * so pages can display a sign-in prompt instead of an infinite spinner.
 */
export function useDataConnect<T = any, V = any>({ 
  query, 
  variables, 
  skip = false,
  refreshInterval
}: UseDataConnectOptions<T, V>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);
  const { loading: authLoading, profile, user } = useAuth();

  // Derived flag: auth has finished loading but no user is signed in
  const unauthenticated = !authLoading && !user;

  const fetcher = useCallback(async (silent = false) => {
    // Wait for auth to resolve before making requests
    if (authLoading || skip) return;

    // If no user is signed in, stop loading and bail out.
    // All Data Connect operations use @auth(level: USER) which requires authentication.
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Most queries require a tenantId and businessId. If the variables are missing them, 
    // but the query expects them, we should wait until the profile is loaded.
    // We assume if variables are partially provided, we should just send them.
    
    try {
      if (!silent) setLoading(true);
      setError(null);
      
      // We know the generated Data Connect queries take variables and return { data }
      const result = await query(variables as V);
      setData(result.data);
    } catch (err: any) {
      console.error('Data Connect Query Error:', err);
      
      const isInvalidRefreshToken = err && (
        err.message?.includes('auth/invalid-refresh-token') ||
        err.code === 'auth/invalid-refresh-token' ||
        JSON.stringify(err).includes('auth/invalid-refresh-token')
      );

      if (isInvalidRefreshToken) {
        console.warn('Invalid refresh token detected. Signing out user...');
        try {
          const { signOut } = await import('firebase/auth');
          const { auth } = await import('@/lib/firebase');
          await signOut(auth);
        } catch (signOutErr) {
          console.error('Failed to sign out after invalid refresh token:', signOutErr);
        }
      }

      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
    // We stringify variables to safely use them as a dependency
  }, [query, skip, authLoading, user, JSON.stringify(variables)]);

  useEffect(() => {
    fetcher(false);
  }, [fetcher]);

  // Refresh immediately after any successful mutation. This keeps dashboards,
  // counters and tables synchronized without a manual browser refresh.
  useEffect(() => {
    if (skip || unauthenticated) return;
    const refreshSilently = () => { void fetcher(true); };
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'smarterp:last-change') refreshSilently();
    };
    window.addEventListener('smarterp:data-changed', refreshSilently);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refreshSilently);
    return () => {
      window.removeEventListener('smarterp:data-changed', refreshSilently);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refreshSilently);
    };
  }, [skip, unauthenticated, fetcher]);

  // Set up polling interval if refreshInterval is provided
  useEffect(() => {
    if (skip || !refreshInterval || unauthenticated) return;

    const intervalId = setInterval(() => {
      // Fetch without toggling the primary loading spinner for smoother background reload
      query(variables).then((result: any) => {
        setData(result.data);
      }).catch((err: any) => {
        console.warn('Data Connect background refresh failed:', err);
      });
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [query, skip, refreshInterval, unauthenticated, JSON.stringify(variables)]);

  return { data: data as any, loading, error, unauthenticated, refetch: () => fetcher(true) };
}
