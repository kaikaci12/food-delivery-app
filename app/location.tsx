import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const LocationScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestLocation = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Location permission is required to continue.");
      setLoading(false);
      return;
    }

    try {
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
    } catch (error) {
      setErrorMsg("Unable to retrieve location. Please try again.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Location Image */}
      <Image
        style={styles.image}
        source={require("../assets/images/location.png")}
        resizeMode="contain"
      />

      {/* Location Access Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={requestLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText} numberOfLines={1}>
              ACCESS LOCATION
            </Text>
            <Ionicons name="location" size={18} color="white" />
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.infoText}>
        This app will access your location {"\n"} only while using the app.
      </Text>

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 50,
    backgroundColor: "#FF6B00",
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  infoText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    marginTop: 15,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});
