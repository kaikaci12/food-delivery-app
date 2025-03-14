import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Firebase import
import { useAuth } from "@/context/AuthProvider";

const LoginComponent = () => {
  const { onLogin, authState } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [toggleCheckBox, setToggleCheckBox] = useState(false); // Remember me state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const handleRememberMe = () => {
    setToggleCheckBox((prev) => !prev);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(""); // Reset error

    try {
      await onLogin(email, password);
      alert("Logged In Successfully ✅");
      router.replace("/location");
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred.";

      if (errorMessage.includes("invalid-credential")) {
        alert("Invalid Credentials ❌");
      } else if (errorMessage.includes("too-many-requests")) {
        alert("Too many failed login attempts. Please try again later.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
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
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="•••••••••••"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

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
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading} // Disable button when loading
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging In..." : "LOG IN"}
          </Text>
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
    top: 10,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
});
