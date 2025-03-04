import { StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { db } from "@/firebaseConfig";
import { getDoc, setDoc, doc } from "firebase/firestore";
const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    user: any | null;
  }>({
    token: null,
    user: null,
  });

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
  const login = (username: string, password: string) => {};
  const logOut = () => {};

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
