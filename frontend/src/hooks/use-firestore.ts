"use client"

import { useEffect, useState } from "react"

/**
 * Firestore client workflows are retired. Data Connect and Neon are accessed
 * through authenticated Next.js routes; returning fixture data here would turn
 * a backend outage into a misleading successful UI state.
 */
export function useFirestore<T>(collectionName: string) {
  const [error] = useState(
    () => new Error(`Direct Firestore access to ${collectionName} is retired; use the authenticated API service`),
  )

  useEffect(() => {
    // Preserve the hook shape for legacy screens while failing closed.
  }, [])

  const addRecord = async (_newData: Omit<T, "id">): Promise<never> => {
    throw error
  }
  const updateRecord = async (_id: string, _updatedData: Partial<T>): Promise<never> => {
    throw error
  }
  const deleteRecord = async (_id: string): Promise<never> => {
    throw error
  }

  return {
    data: [] as T[],
    loading: false,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
  }
}
