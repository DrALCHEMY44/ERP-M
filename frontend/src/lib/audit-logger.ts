
import { auth } from './firebase';

/**
 * Automatically records system activities to the SQL Connect database.
 */
export async function logActivity(params: {
  actionType: string;
  module: string;
  description: string;
  oldValue?: any;
  newValue?: any;
  recordId?: string;
  userProfile?: {
    tenantId: string;
    businessId: string;
    uid: string;
    fullName?: string | null;
    role?: string;
  };
}) {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Authentication required');
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
      actionType: params.actionType,
      module: params.module,
      description: params.description,
      recordId: params.recordId,
      }),
    });
    if (!response.ok) throw new Error('Audit write failed');
  } catch (error) {
    console.error('Audit Logger Error:', error);
  }
}
