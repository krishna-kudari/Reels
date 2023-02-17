import React, { createContext, useContext, useEffect, useState } from "react";
import app from "@/firebase/app";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/auth";
import { User, UserCredential } from "firebase/auth";

type AuthContextType = {
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
};

// 🧱 Create an AuthContext
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  signIn: () => Promise.reject(new Error("Not implemented")),
  createUser: () => Promise.reject(new Error("Not implemented")),
  logOut: () => Promise.reject(new Error("Not implemented")),
});

// 🧱 Create a costum hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const signIn = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const createUser = (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logOut = (): Promise<void> => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    signIn,
    createUser,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {currentUser && children}
    </AuthContext.Provider>
  );
};
