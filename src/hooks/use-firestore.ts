
"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
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
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MOCK_USER, MOCK_CUSTOMERS, MOCK_PRODUCTS, MOCK_TASKS, MOCK_SALES, MOCK_EXPENSES, MOCK_ACTIVITY_LOGS } from '@/lib/mock-data';

/**
 * A custom hook for Firestore real-time data with multi-tenant filtering.
 * Includes a LocalStorage fallback for prototyping when Firebase keys are not yet configured.
 */
export function useFirestore<T>(collectionName: string, extraConstraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Check if Firebase is using placeholder keys
  const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                               process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "placeholder-key";

  // Local storage keys for fallback
  const storageKey = `erp_fallback_${collectionName}`;

  // Helper to get local data
  const getLocalData = (): T[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  };

  // Helper to save local data
  const saveLocalData = (newData: T[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  useEffect(() => {
    setLoading(true);

    // If Firebase isn't configured, use LocalStorage fallback immediately
    if (!isFirebaseConfigured) {
      console.warn(`Firebase not configured for ${collectionName}. Falling back to LocalStorage.`);
      const local = getLocalData();
      
      // Seed with mock data if local storage is empty for this collection
      if (local.length === 0) {
        let seeds: any[] = [];
        if (collectionName === 'customers') seeds = MOCK_CUSTOMERS;
        if (collectionName === 'products') seeds = MOCK_PRODUCTS;
        if (collectionName === 'tasks') seeds = MOCK_TASKS;
        if (collectionName === 'sales') seeds = MOCK_SALES;
        if (collectionName === 'expenses') seeds = MOCK_EXPENSES;
        if (collectionName === 'activity_logs') seeds = MOCK_ACTIVITY_LOGS;
        
        if (seeds.length > 0) {
          saveLocalData(seeds);
          setData(seeds);
        } else {
          setData([]);
        }
      } else {
        setData(local);
      }
      setLoading(false);
      return;
    }

    // Standard Firestore Real-time listener
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
        
        // If Firestore is empty but we have seeds, we could add them here, 
        // but typically we want to start fresh in cloud.
        setData(results);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err);
        setLoading(false);
        // Fallback on error
        setData(getLocalData());
      }
    );

    return () => unsubscribe();
  }, [collectionName, isFirebaseConfigured]);

  const addRecord = useCallback(async (newData: Omit<T, 'id'>) => {
    const cleanData = Object.fromEntries(
      Object.entries(newData).filter(([k, v]) => v !== undefined && k !== 'id')
    );

    const payload = {
      ...cleanData,
      tenantId: MOCK_USER.tenantId,
      businessId: MOCK_USER.businessId,
      createdAt: new Date().toISOString(),
    };

    if (!isFirebaseConfigured) {
      const current = getLocalData();
      const newId = `local_${Math.random().toString(36).substr(2, 9)}`;
      const newEntry = { id: newId, ...payload } as T;
      const updated = [newEntry, ...current];
      saveLocalData(updated);
      setData(updated);
      return newId;
    }

    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...payload,
        serverCreatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.error(`Error adding to ${collectionName}:`, err);
      throw err;
    }
  }, [collectionName, isFirebaseConfigured]);

  const updateRecord = useCallback(async (id: string, updatedData: Partial<T>) => {
    const cleanData = Object.fromEntries(
      Object.entries(updatedData).filter(([k, v]) => v !== undefined && k !== 'id')
    );

    if (!isFirebaseConfigured) {
      const current = getLocalData();
      const updated = current.map((item: any) => 
        item.id === id ? { ...item, ...cleanData, updatedAt: new Date().toISOString() } : item
      );
      saveLocalData(updated);
      setData(updated as T[]);
      return;
    }

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...cleanData,
        updatedAt: new Date().toISOString(),
        serverUpdatedAt: serverTimestamp(),
      } as DocumentData);
    } catch (err) {
      console.error(`Error updating ${collectionName}:`, err);
      throw err;
    }
  }, [collectionName, isFirebaseConfigured]);

  const deleteRecord = useCallback(async (id: string) => {
    if (!isFirebaseConfigured) {
      const current = getLocalData();
      const updated = current.filter((item: any) => item.id !== id);
      saveLocalData(updated);
      setData(updated as T[]);
      return;
    }

    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error(`Error deleting from ${collectionName}:`, err);
      throw err;
    }
  }, [collectionName, isFirebaseConfigured]);

  return { data, loading, error, addRecord, updateRecord, deleteRecord };
}
