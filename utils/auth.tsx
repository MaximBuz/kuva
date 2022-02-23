import React, { useContext, useState, useEffect } from 'react';

/* FIREBASE */
import { User, UserCredential } from '@firebase/auth-types';
import { auth } from './firebase';
import {
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 onAuthStateChanged,
 signOut,
 sendPasswordResetEmail
} from 'firebase/auth';


const AuthContext = React.createContext<any>(null);

export function useAuth() {
 return useContext(AuthContext);
}

export function AuthProvider({ children } : {children: React.ReactNode}) : JSX.Element {
 const [currentUser, setCurrentUser] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 function signup(email:string, password:string) {
  return createUserWithEmailAndPassword(auth, email, password);
 }

 function login(email:string, password:string) {
  return signInWithEmailAndPassword(auth, email, password);
 }

 function logout(): Promise<void> {
  return signOut(auth);
 }

 function resetPassword( email:string ) {
  return sendPasswordResetEmail(auth, email)
 }

 useEffect(() => {
  onAuthStateChanged(auth, (user) => {
   setCurrentUser(user);
   setLoading(false);
  });
 }, []);

 const value = {
  currentUser,
  signup,
  login,
  logout,
  resetPassword
 };

 return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}