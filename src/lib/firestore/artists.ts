import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Artist, ArtistFormData } from '@/types/artist';

const COLLECTION = 'artists';

export const getArtists = async (): Promise<Artist[]> => {
  const q = query(collection(db, COLLECTION), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Artist));
};

export const getFeaturedArtists = async (): Promise<Artist[]> => {
  const q = query(collection(db, COLLECTION), where('featured', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Artist));
};

export const getArtist = async (id: string): Promise<Artist | null> => {
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Artist;
};

export const createArtist = async (
  data: ArtistFormData & { avatarUrl: string; coverUrl: string }
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateArtist = async (id: string, data: Partial<ArtistFormData>): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteArtist = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};
