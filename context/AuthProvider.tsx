import { StyleSheet, Text, View } from "react-native";
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
import { getDoc, setDoc, doc, onSnapshot } from "firebase/firestore";
const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    user: any | null;
  }>({
    token: null,
    user: null,
  });
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const userRef = doc(db, "users", user.uid);

          // Subscribe to real-time Firestore updates
          const unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              setAuthState({
                token,
                user: { uid: user.uid, email: user.email, ...docSnap.data() },
              });
            }
          });

          return () => unsubscribeFirestore();
        } catch (error: any) {
          console.log(error.message);
        }
      } else {
        setAuthState({ token: null, user: null });
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
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
        createdAt: new Date(),
      };
      await setDoc(userRef, userProfile);
    } catch (error: any) {
      console.log(error.messsage);
    }
  };
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const logOut = async () => {
    try {
      await signOut(auth);
      setAuthState({
        token: null,
        user: null,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logOut,
    authState,
  };
  return (
    <AuthContext.Provider
      value={value}
      children={children}
    ></AuthContext.Provider>
  );
};

export default AuthProvider;

const styles = StyleSheet.create({});
export const useAuth = () => useContext(AuthContext);
