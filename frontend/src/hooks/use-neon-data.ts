import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { isAuthenticationFailure, recoverAuthenticationSession } from '@/lib/auth/session-recovery';

type DataQuery<V> = (variables: V) => PromiseLike<{ data: unknown }>;

interface UseNeonDataOptions<V> {
  query: DataQuery<V>;
  variables?: V;
  skip?: boolean;
  refreshInterval?: number; // Time in milliseconds to poll the database
}

/**
 * Compatibility hook for authenticated Neon-backed API query functions.
 * Handles loading states, errors, and provides a `refetch` function.
 * Returns `unauthenticated: true` when the user is not signed in,
 * so pages can display a sign-in prompt instead of an infinite spinner.
 */
export function useNeonData<T = any, V = any>({
  query,
  variables,
  skip = false,
  refreshInterval
}: UseNeonDataOptions<V>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);
  const { loading: authLoading, user } = useAuth();
  const variablesKey = JSON.stringify(variables);
  const inFlightKeys = useRef(new Set<string>());

  // Derived flag: auth has finished loading but no user is signed in
  const unauthenticated = !authLoading && !user;

  const fetcher = useCallback(async (silent = false) => {
    // Wait for auth to resolve before making requests
    if (authLoading || skip) return;

    // If no user is signed in, stop loading and bail out.
    // Secure wrappers call authenticated server routes; generated operations are NO_ACCESS to clients.
    if (!user) {
      setLoading(false);
      return;
    }

    // Most queries require a tenantId and businessId. If the variables are missing them,
    // but the query expects them, we should wait until the profile is loaded.
    // We assume if variables are partially provided, we should just send them.

    if (typeof query !== 'function') {
      setLoading(false);
      setError(new Error('The data query module is unavailable. Restart the Next.js development server and reload this page.'));
      return;
    }
    if (inFlightKeys.current.has(variablesKey)) return;
    inFlightKeys.current.add(variablesKey);

    try {
      if (!silent) setLoading(true);
      setError(null);

      // Secure API query functions take variables and return { data }.
      const result = await query(variables as V);
      setData(result.data as T);
    } catch (err: any) {
      if (isAuthenticationFailure(err)) {
        console.warn('Neon session is missing or expired; returning to sign in.');
        setError(null);
        await recoverAuthenticationSession();
        return;
      }

      if (typeof err === 'object' && err && 'status' in err && err.status === 503) {
        console.warn('Neon database is temporarily unreachable; keeping the last successful data snapshot.');
      } else {
        console.error('Neon API query error:', err);
      }
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      inFlightKeys.current.delete(variablesKey);
      setLoading(false);
    }
    // We stringify variables to safely use them as a dependency
    // variablesKey provides a stable deep dependency for inline variables.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, skip, authLoading, user, variablesKey]);

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
      void fetcher(true);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [fetcher, skip, refreshInterval, unauthenticated]);

  return { data, loading, error, unauthenticated, refetch: () => fetcher(true) };
}
