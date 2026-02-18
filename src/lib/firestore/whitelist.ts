import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { AdminUser } from '@/types/admin';

const COLLECTION = 'admins';
const INVITED_COLLECTION = 'invited_emails';

export const getWhitelist = async (): Promise<AdminUser[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({ userId: d.id, ...d.data() } as AdminUser));
};

export const checkIsAdmin = async (userId: string, email?: string): Promise<boolean> => {
  const docRef = doc(db, COLLECTION, userId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return true;

  // 若尚未是 admin，檢查 email 是否在受邀名單，是則自動升級
  if (email) {
    const inviteRef = doc(db, INVITED_COLLECTION, email);
    const inviteSnap = await getDoc(inviteRef);
    if (inviteSnap.exists()) {
      await setDoc(doc(db, COLLECTION, userId), { email, createdAt: new Date(), autoPromoted: true });
      await deleteDoc(inviteRef);
      return true;
    }
  }

  return false;
};

export const addToWhitelist = async (userId: string, email: string): Promise<void> => {
  await setDoc(doc(db, COLLECTION, userId), { email, createdAt: new Date() });
};

export const removeFromWhitelist = async (userId: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, userId));
};

export const inviteByEmail = async (email: string): Promise<void> => {
  await setDoc(doc(db, INVITED_COLLECTION, email), { createdAt: new Date() });
};
