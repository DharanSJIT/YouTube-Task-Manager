import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ALLOWED_EMAILS = [
  import.meta.env.VITE_ALLOWED_EMAIL_1,
  import.meta.env.VITE_ALLOWED_EMAIL_2,
];

export async function login(email: string, password: string): Promise<void> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  if (!ALLOWED_EMAILS.includes(user.email)) {
    await signOut(auth);
    throw new Error('Access denied.');
  }
}

export function logout(): Promise<void> {
  return signOut(auth);
}

export function onAuthChanged(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    if (user && !ALLOWED_EMAILS.includes(user.email)) {
      signOut(auth);
      callback(null);
    } else {
      callback(user);
    }
  });
}
