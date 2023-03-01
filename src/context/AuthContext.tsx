import React, { createContext, useContext, useEffect, useState } from "react";
import app from "@/firebase/app";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase/auth";
import { User, UserCredential } from "firebase/auth";
import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/store";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

type userData = User & DocumentData;

type AuthContextType = {
  currentUser: userData | null;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  signinWithGoogle: () => void;
  signinWithGitHub: () => void;
  loading: boolean;
};

// 🧱 Create an AuthContext
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  signIn: () => Promise.reject(new Error("Not implemented")),
  createUser: () => Promise.reject(new Error("Not implemented")),
  logOut: () => Promise.reject(new Error("Not implemented")),
  signinWithGoogle: () => null,
  signinWithGitHub: () => null,
  loading: true,
});

// 🧱 Create a costum hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<userData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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

  //auth Providers
  const googleprovider = new GoogleAuthProvider();
  const githubprovider = new GithubAuthProvider();

  //AuthProvider mwthods
  const signinWithGoogle = () => {
    signInWithPopup(auth, googleprovider)
      .then(async(result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) throw new Error("No credential");
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const {email , photoURL , uid , displayName} = user;
        const userDoc = {
          username : displayName,
          email: email,
          password: "",
          profile_picture_url: photoURL,
          userId : uid,
          posts : []
        }
        await setDoc(doc(db, "users", uid), userDoc);
        toast.success("account created");
        console.log(user);
        router.replace("/");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(credential, email, errorMessage, errorCode);
      });
  };
  const signinWithGitHub = () => {
    signInWithPopup(auth, githubprovider)
      .then(async(result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (!credential) throw new Error("No credential");
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const {email , photoURL , uid , displayName} = user;
        const userDoc = {
          username : displayName,
          email: email,
          password: "",
          profile_picture_url: photoURL,
          userId : uid,
          posts : []
        }
        await setDoc(doc(db, "users", uid), userDoc);
        toast.success("account created");
        router.replace("/")
      })
      .catch((error: any) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
        console.log(credential, email, errorMessage, errorCode);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("AuthState changed",user);
      if(user) {
        const docRef = doc(db,"users",user.uid);
        const docSnap =await getDoc(docRef);
        if(docSnap.exists()) {
          console.log("USerData",);
          const userData = docSnap.data();
          const currentUser = {...user , ...userData};
          setCurrentUser(currentUser);
          console.log(currentUser);
          setLoading(false);
        }else{
          setLoading(false);
        }
      }else{
        setCurrentUser(null);
        setLoading(false);
      }
      
    });
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    signIn,
    createUser,
    logOut,
    signinWithGoogle,
    signinWithGitHub,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      { children}
    </AuthContext.Provider>
  );
};
