
"use client"

import { useState, useEffect } from 'react';
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
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MOCK_USER } from '@/lib/mock-data';

/**
 * A custom hook for Firestore real-time data with multi-tenant filtering.
 */
export function useFirestore<T>(collectionName: string, extraConstraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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

  const addRecord = async (newData: Omit<T, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...newData,
        tenantId: MOCK_USER.tenantId,
        businessId: MOCK_USER.businessId,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (err) {
      console.error(`Error adding to ${collectionName}:`, err);
      throw err;
    }
  };

  const updateRecord = async (id: string, updatedData: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updatedData as DocumentData);
    } catch (err) {
      console.error(`Error updating ${collectionName}:`, err);
      throw err;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error(`Error deleting from ${collectionName}:`, err);
      throw err;
    }
  };

  return { data, loading, error, addRecord, updateRecord, deleteRecord };
}
