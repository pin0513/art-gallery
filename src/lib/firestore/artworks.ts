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
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Artwork, ArtworkFormData } from '@/types/artwork';

const COLLECTION = 'artworks';

export const getArtworks = async (): Promise<Artwork[]> => {
  const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  } as Artwork));
};

export const getFeaturedArtworks = async (count = 6): Promise<Artwork[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('featured', '==', true),
    orderBy('order', 'asc'),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  } as Artwork));
};

export const getArtwork = async (id: string): Promise<Artwork | null> => {
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate(),
  } as Artwork;
};

export const createArtwork = async (
  data: ArtworkFormData & { imageUrl: string; thumbnailUrl: string }
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateArtwork = async (id: string, data: Partial<ArtworkFormData>): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteArtwork = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};

export const getArtworksByArtist = async (artistId: string): Promise<Artwork[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('artistId', '==', artistId),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  } as Artwork));
};
