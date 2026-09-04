
/**
 * Automatically records system activities in Neon through the trusted API.
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
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
