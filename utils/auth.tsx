import React, { useContext, useState, useEffect } from 'react';

/* FIREBASE */
import { auth, firestore } from './firebase';
import {
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 onAuthStateChanged,
 signOut,
 sendPasswordResetEmail,
} from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useFirestoreDocumentData } from '@react-query-firebase/firestore';

const AuthContext = React.createContext<any>(null);

export function useAuth() {
 return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
 const [currentUser, setCurrentUser] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 function signup(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
 }

 function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
 }

 function logout(): Promise<void> {
  return signOut(auth);
 }

 function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
 }

 async function refreshUser(user: any) {
   const userDoc = await getDoc(doc(firestore, 'users', user.uid));
   userDoc.exists() ? setCurrentUser(userDoc.data()) : setCurrentUser(undefined);
   setLoading(false);
 }

 useEffect(() => {
  onAuthStateChanged(auth, async (user) => {
   const userDoc = user ? await getDoc(doc(firestore, 'users', user.uid)) : undefined;
   userDoc && userDoc.exists() ? setCurrentUser(userDoc.data()) : setCurrentUser(user);
   setLoading(false);
  });
 }, []);

 const value = {
  currentUser,
  signup,
  login,
  logout,
  resetPassword,
  refreshUser
 };

 return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
