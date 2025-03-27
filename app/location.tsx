import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocation } from "@/context/LocationProvider";
import LoadingAnimation from "@/components/Loading";

const LocationScreen = () => {
  const { location, errorMsg, loading, requestLocation } = useLocation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/images/location.png")}
        resizeMode="contain"
      />

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

      {loading ? (
        <LoadingAnimation />
      ) : location ? (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation
            showsBuildings
            showsCompass
            scrollEnabled
            showsMyLocationButton
            style={styles.map}
          ></MapView>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.replace("/Dashboard")}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
    width: 180,
    height: 180,
    marginBottom: 25,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    height: 50,
    backgroundColor: "#FF6B00",
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  infoText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  errorText: {
    color: "#FF4C4C",
    fontSize: 14,
    marginTop: 12,
    paddingHorizontal: 12,
    textAlign: "center",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  mapContainer: {
    width: "90%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  map: {
    minWidth: "100%",
    height: 220,
  },
  continueButton: {
    marginTop: 15,
    backgroundColor: "#008060",
    width: "85%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  continueButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
