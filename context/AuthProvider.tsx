import { StyleSheet, Text, View } from "react-native";
import { useContext, useState } from "react";
import React from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });
  const register = (username: string, email: string, password: string) => {};
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
