
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { MOCK_USER } from './mock-data';
import { ActivityLog } from './types';

/**
 * Automatically records system activities to Firestore.
 * This is an append-only collection for audit purposes.
 */
export async function logActivity(params: {
  actionType: string;
  module: string;
  description: string;
  oldValue?: any;
  newValue?: any;
  recordId?: string;
}) {
  try {
    const logData: Omit<ActivityLog, 'id'> = {
      tenantId: MOCK_USER.tenantId,
      businessId: MOCK_USER.businessId,
      userId: MOCK_USER.uid,
      userName: MOCK_USER.fullName,
      userRole: MOCK_USER.role,
      actionType: params.actionType,
      module: params.module,
      description: params.description,
      oldValue: params.oldValue ? JSON.stringify(params.oldValue) : undefined,
      newValue: params.newValue ? JSON.stringify(params.newValue) : undefined,
      recordId: params.recordId,
      deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server/AI',
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, 'activity_logs'), {
      ...logData,
      serverTimestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Audit Logger Error:', error);
  }
}
