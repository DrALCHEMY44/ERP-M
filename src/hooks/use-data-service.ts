
import { useState, useEffect } from 'react';

/**
 * A React hook to fetch data using a data service function.
 * @param fetcher - An async function that fetches the data.
 * @param params - The parameters to pass to the fetcher function.
 */
export function useDataService<T, P extends any[]>(fetcher: (...args: P) => Promise<T>, ...params: P) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetcher(...params);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetcher, ...params]);

  return { data, loading };
}
