
import { MOCK_USER } from './mock-data';
import { createActivityLogMutation } from './data-service';

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
    const tenantId = params.userProfile?.tenantId || MOCK_USER.tenantId;
    const businessId = params.userProfile?.businessId || MOCK_USER.businessId;
    const userId = params.userProfile?.uid || MOCK_USER.uid;
    const userName = params.userProfile?.fullName || MOCK_USER.fullName;

    await createActivityLogMutation({
      tenantId,
      businessId,
      userId,
      userName,
      actionType: params.actionType,
      module: params.module,
      description: params.description,
      recordId: params.recordId,
    });
  } catch (error) {
    console.error('Audit Logger Error:', error);
  }
}
