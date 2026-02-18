'use client';
import { useEffect } from 'react';
import { onAuthChange } from '@/lib/auth';
import { checkIsAdmin } from '@/lib/firestore/whitelist';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, isAdmin, loading, setUser, setIsAdmin, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const adminStatus = await checkIsAdmin(firebaseUser.uid, firebaseUser.email ?? undefined);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setIsAdmin, setLoading]);

  return { user, isAdmin, loading };
}
