
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { MOCK_USER } from './mock-data';
import { AppNotification, Role } from './types';

/**
 * Creates a notification in the cloud database.
 */
export async function createNotification(params: {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  module: string;
  targetUserId?: string;
  targetRoles?: Role[];
  link?: string;
}) {
  try {
    const notificationData: Omit<AppNotification, 'id'> = {
      tenantId: MOCK_USER.tenantId,
      businessId: MOCK_USER.businessId,
      targetUserId: params.targetUserId,
      targetRoles: params.targetRoles,
      title: params.title,
      message: params.message,
      type: params.type,
      module: params.module,
      readBy: [],
      createdAt: new Date().toISOString(),
      link: params.link,
    };

    await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      serverTimestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Notification Error:', error);
  }
}
