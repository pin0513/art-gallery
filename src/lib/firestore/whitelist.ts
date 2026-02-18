import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { AdminUser } from '@/types/admin';

const COLLECTION = 'admins';

export const getWhitelist = async (): Promise<AdminUser[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({ userId: d.id, ...d.data() } as AdminUser));
};

export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  const docRef = doc(db, COLLECTION, userId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists();
};

export const addToWhitelist = async (userId: string, email: string): Promise<void> => {
  await setDoc(doc(db, COLLECTION, userId), { email, createdAt: new Date() });
};

export const removeFromWhitelist = async (userId: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, userId));
};
