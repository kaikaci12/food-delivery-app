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
import { setDoc, doc, onSnapshot } from "firebase/firestore";

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

  const saveUidToStorage = async (uid: string) => {
    try {
      await SecureStore.setItemAsync(UID_KEY, uid);
    } catch (error) {
      console.error("Failed to save UID to SecureStore:", error);
    }
  };

  // Load user UID from SecureStore
  const loadUidFromStorage = async () => {
    try {
      const uid = await SecureStore.getItemAsync(UID_KEY);
      return uid;
    } catch (error) {
      console.error("Failed to load UID from SecureStore:", error);
      return null;
    }
  };

  // Clear user UID from SecureStore
  const clearUidFromStorage = async () => {
    try {
      await SecureStore.deleteItemAsync(UID_KEY);
    } catch (error) {
      console.error("Failed to clear UID from SecureStore:", error);
    }
  };

  // Fetch user data from Firestore using UID
  const fetchUserData = async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userProfile = docSnap.data(); // Get the latest user data
        setAuthState((prev) => ({ ...prev, user: userProfile }));
      } else {
        console.error("User document does not exist in Firestore");
        setAuthState((prev) => ({ ...prev, user: null }));
      }
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const initializeAuth = async () => {
      const uid = await loadUidFromStorage();
      if (uid) {
        unsubscribeSnapshot = await fetchUserData(uid);
      }
      setLoading(false);
    };

    initializeAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await saveUidToStorage(user.uid);

        if (unsubscribeSnapshot) unsubscribeSnapshot(); // Cleanup old snapshot
        unsubscribeSnapshot = await fetchUserData(user.uid);

        setAuthState((prev) => ({ ...prev, token }));
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await clearUidFromStorage();
        setAuthState({ token: null, user: null });

        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

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

      // Fetch user data from Firestore
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
