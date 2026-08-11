
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
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
  userProfile?: {
    tenantId: string;
    businessId: string;
  };
}) {
  if (!params.userProfile) throw new Error('Authenticated tenant profile is required')
  const notificationData: Omit<AppNotification, 'id'> = {
      tenantId: params.userProfile.tenantId,
      businessId: params.userProfile.businessId,
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
}
