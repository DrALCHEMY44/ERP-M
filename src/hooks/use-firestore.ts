
"use client"

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  DocumentData,
  QueryConstraint,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MOCK_USER } from '@/lib/mock-data';

/**
 * A custom hook for Firestore real-time data with multi-tenant filtering.
 * Optimized for synchronization and fast response times.
 */
export function useFirestore<T>(collectionName: string, extraConstraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    // Filter by the current user's tenant and business for security and isolation
    const q = query(
      collection(db, collectionName),
      where('tenantId', '==', MOCK_USER.tenantId),
      where('businessId', '==', MOCK_USER.businessId),
      ...extraConstraints
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results: T[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(results);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  const addRecord = useCallback(async (newData: Omit<T, 'id'>) => {
    try {
      // Remove 'id' if it exists and filter out undefined values which Firestore doesn't support
      const { id: _id, ...dataToSave } = newData as any;
      const cleanData = Object.fromEntries(
        Object.entries(dataToSave).filter(([_, v]) => v !== undefined)
      );

      const docRef = await addDoc(collection(db, collectionName), {
        ...cleanData,
        tenantId: MOCK_USER.tenantId,
        businessId: MOCK_USER.businessId,
        createdAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.error(`Error adding to ${collectionName}:`, err);
      throw err;
    }
  }, [collectionName]);

  const updateRecord = useCallback(async (id: string, updatedData: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      // Remove 'id' from payload and filter undefined
      const { id: _id, ...dataToUpdate } = updatedData as any;
      const cleanData = Object.fromEntries(
        Object.entries(dataToUpdate).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(docRef, {
        ...cleanData,
        updatedAt: new Date().toISOString(),
        serverUpdatedAt: serverTimestamp(),
      } as DocumentData);
    } catch (err) {
      console.error(`Error updating ${collectionName}:`, err);
      throw err;
    }
  }, [collectionName]);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error(`Error deleting from ${collectionName}:`, err);
      throw err;
    }
  }, [collectionName]);

  return { data, loading, error, addRecord, updateRecord, deleteRecord };
}
