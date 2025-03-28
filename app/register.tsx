import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthProvider";

const SignUp = () => {
  const router = useRouter();
  const { onRegister } = useAuth(); // Assuming you have onRegister function in context

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationError, setValidationError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // To track if the form was submitted

  const handleRegister = async () => {
    setIsSubmitted(true); // Mark as submitted
    setValidationError("");
    if (!username || !email || !password || !confirmPassword) {
      setValidationError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    try {
      await onRegister!(username, email, password);

      alert("Registered Successfully ✅");
      router.push("/location");
    } catch (error: any) {
      setValidationError("An error occurred. Please try again.");
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.heading}>Sign Up</Text>
        <Text style={styles.subheading}>Please sign up to get started</Text>
      </View>

      {/* Form Section */}
      <View style={styles.form}>
        <Text style={styles.label}>NAME</Text>
        <TextInput
          style={[
            styles.input,
            isSubmitted && !username && validationError && styles.errorInput,
          ]}
          placeholder="John Doe"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={[
            styles.input,
            isSubmitted && !email && validationError && styles.errorInput,
          ]}
          placeholder="example@gmail.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>PASSWORD</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              isSubmitted && !password && validationError && styles.errorInput,
            ]}
            placeholder="••••••••••"
            placeholderTextColor="#999"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>RE-TYPE PASSWORD</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              isSubmitted &&
                !confirmPassword &&
                validationError &&
                styles.errorInput,
            ]}
            placeholder="••••••••••"
            placeholderTextColor="#999"
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Ionicons
              name={confirmPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account?</Text>
        <TouchableOpacity>
          <Link href="/login">
            <Text style={styles.signupLink}> LOG IN</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#101828",
    height: 180,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  subheading: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 5,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: -20,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  errorInput: {
    borderColor: "#FF6B6B",
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
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
  errorText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
