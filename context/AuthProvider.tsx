import { useContext, useEffect, useState } from "react";
import React from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db } from "@/firebaseConfig";
import * as SecureStore from "expo-secure-store";
import { setDoc, doc, onSnapshot, getDoc } from "firebase/firestore";

const TOKEN_KEY = "myjwt";
const UID_KEY = "userUid"; // Key for storing the user's UID in SecureStore

const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    user: any | null;
  }>({
    token: null,
    user: null,
  });

  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = await SecureStore.getItemAsync(UID_KEY);
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (uid) {
          const userRef = doc(db, "users", uid);
          const user = await getDoc(userRef);
          setAuthState({
            token,
            user,
          });
          setLoading(false);
        } else {
          console.log("uid is null");
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadUser();
  }, []);
  const fetchUserData = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setAuthState((prev) => ({
          ...prev,
          user: userSnap.data(),
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const saveUidToStorage = async (uid: string) => {
    try {
      await SecureStore.setItemAsync(UID_KEY, uid);
    } catch (error) {
      console.error("Failed to save UID to SecureStore:", error);
    }
  };
  const clearUidFromStorage = async () => {
    try {
      await SecureStore.deleteItemAsync(UID_KEY);
    } catch (error) {
      console.error("Failed to clear UID from SecureStore:", error);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userProfile = {
        uid: user.uid,
        username,
        email,
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, userProfile);
      await SecureStore.setItemAsync(TOKEN_KEY, await user.getIdToken());
      await saveUidToStorage(user.uid);
      setAuthState({
        token: await user.getIdToken(),
        user: userProfile,
      });
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredentials.user.getIdToken();
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await saveUidToStorage(userCredentials.user.uid);

      await fetchUserData(userCredentials.user.uid);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setAuthState({ token: null, user: null });
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await clearUidFromStorage();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logOut,
    authState,
    loading, // Expose loading state
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
