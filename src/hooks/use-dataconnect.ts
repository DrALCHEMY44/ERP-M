import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface UseDataConnectOptions<T, V> {
  query: any; // Using any to avoid overload resolution issues with DataConnect queries
  variables?: V;
  skip?: boolean;
}

/**
 * A React hook to fetch data using Firebase Data Connect SDK queries.
 * Handles loading states, errors, and provides a `refetch` function.
 * Returns `unauthenticated: true` when the user is not signed in,
 * so pages can display a sign-in prompt instead of an infinite spinner.
 */
export function useDataConnect<T = any, V = any>({ query, variables, skip = false }: UseDataConnectOptions<T, V>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);
  const { loading: authLoading, profile, user } = useAuth();

  // Derived flag: auth has finished loading but no user is signed in
  const unauthenticated = !authLoading && !user;

  const fetcher = useCallback(async () => {
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
      setLoading(true);
      setError(null);
      
      // We know the generated Data Connect queries take variables and return { data }
      const result = await query(variables as V);
      setData(result.data);
    } catch (err) {
      console.error('Data Connect Query Error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
    // We stringify variables to safely use them as a dependency
  }, [query, skip, authLoading, user, JSON.stringify(variables)]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return { data: data as any, loading, error, unauthenticated, refetch: fetcher };
}
