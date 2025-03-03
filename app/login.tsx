import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
const LoginComponent = () => {
  const router = useRouter();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const handleRememberMe = () => {
    setToggleCheckBox((prev) => !prev);
    if (toggleCheckBox) {
      // will execute in future
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      {/* Top Dark Section */}
      <View style={styles.header}>
        <Text style={styles.heading}>Log In</Text>
        <Text style={styles.subheading}>
          Please sign in to your existing account
        </Text>
      </View>

      {/* White Card Section */}
      <View style={styles.card}>
        {/* Email Input */}
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
        />

        {/* Password Input */}
        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="•••••••••••"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        {/* Remember Me & Forgot Password */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.remember} onPress={handleRememberMe}>
            {!toggleCheckBox ? (
              <Fontisto name="checkbox-passive" size={24} color="black" />
            ) : (
              <Fontisto name="checkbox-active" size={24} color="black" />
            )}

            <Text style={styles.optionText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity>
            <Link href={"/register"}>
              <Text style={styles.signupLink}> SIGN UP</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // Dark blue background
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 50,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subheading: {
    fontSize: 16,
    color: "#CDD5E0",
    marginTop: 5,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F5F5F5",
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  optionText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 16,
    color: "#777",
  },
  signupLink: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  remember: {
    flexDirection: "row",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
  },
});
