
import { tables } from '@/dataconnect-generated';
import { connector } from '@/dataconnect-generated/dataconnect';

/**
 * Fetches a user by their email address from the database.
 *
 * @param email - The email of the user to retrieve.
 * @returns The user object if found, otherwise null.
 */
export async function getUserByEmail(email: string) {
  const result = await tables.User({ db: connector }).where({ email: { eq: email } }).get();
  return result ?? null;
}

