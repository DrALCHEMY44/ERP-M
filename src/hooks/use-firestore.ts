
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
import { useAuth } from '@/hooks/use-auth';
import { MOCK_USER, MOCK_CUSTOMERS, MOCK_PRODUCTS, MOCK_TASKS, MOCK_SALES, MOCK_EXPENSES, MOCK_ACTIVITY_LOGS, MOCK_TENANTS } from '@/lib/mock-data';

interface FirestoreHookOptions {
  extraConstraints?: QueryConstraint[];
  bypassFilter?: boolean; // Set true for Super Admins to see all data
}

/**
 * A custom hook for Firestore real-time data with multi-tenant filtering.
 * Includes a LocalStorage fallback for prototyping.
 */
export function useFirestore<T>(collectionName: string, options: FirestoreHookOptions = {}) {
  const { extraConstraints = [], bypassFilter = false } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user, profile, loading: authLoading } = useAuth();

  const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                               process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "placeholder-key";

  const storageKey = `erp_fallback_${collectionName}`;

  const getLocalData = (): T[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  };

  const saveLocalData = (newData: T[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  useEffect(() => {
    // If auth is still loading, wait before initializing Firestore queries
    if (authLoading && isFirebaseConfigured) return;

    setLoading(true);

    if (!isFirebaseConfigured) {
      const local = getLocalData();
      if (local.length === 0) {
        let seeds: any[] = [];
        if (collectionName === 'customers') seeds = MOCK_CUSTOMERS;
        if (collectionName === 'products') seeds = MOCK_PRODUCTS;
        if (collectionName === 'tasks') seeds = MOCK_TASKS;
        if (collectionName === 'sales') seeds = MOCK_SALES;
        if (collectionName === 'expenses') seeds = MOCK_EXPENSES;
        if (collectionName === 'activity_logs') seeds = MOCK_ACTIVITY_LOGS;
        if (collectionName === 'tenants') seeds = MOCK_TENANTS;
        
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

    // Determine tenant context from real profile or fallback to mock for dev
    const activeTenantId = profile?.tenantId || MOCK_USER.tenantId;
    const activeBusinessId = profile?.businessId || MOCK_USER.businessId;

    let q = query(collection(db, collectionName), ...extraConstraints);
    
    // Only apply tenant filter if not bypassed (e.g., for Super Admin)
    if (!bypassFilter && collectionName !== 'tenants' && collectionName !== 'users') {
      q = query(
        q, 
        where('tenantId', '==', activeTenantId),
        where('businessId', '==', activeBusinessId)
      );
    }

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
        setData(getLocalData());
      }
    );

    return () => unsubscribe();
  }, [collectionName, isFirebaseConfigured, bypassFilter, profile, authLoading]);

  const addRecord = useCallback(async (newData: Omit<T, 'id'>) => {
    // Strip out undefined or ID fields before sending to Firestore
    const cleanData = Object.fromEntries(
      Object.entries(newData).filter(([k, v]) => v !== undefined && k !== 'id')
    );

    const activeTenantId = profile?.tenantId || MOCK_USER.tenantId;
    const activeBusinessId = profile?.businessId || MOCK_USER.businessId;

    const payload = {
      ...cleanData,
      tenantId: activeTenantId,
      businessId: activeBusinessId,
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
  }, [collectionName, isFirebaseConfigured, profile]);

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
