import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LocationScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<any>();
  const requestLocation = async () => {
    setLoading(true);
    setErrorMsg(null);

    // Request permission properly
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMsg("Location permission is required to continue.");
      setLoading(false);
      return;
    }

    try {
      let userLocation = await Location.getCurrentPositionAsync();

      setLocation(userLocation);
      setMapRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      console.log("Location:", userLocation);

      router.replace("/Dashboard");
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
      {location && (
        <MapView region={mapRegion} style={styles.map}>
          <Marker coordinate={mapRegion} title="Marker" />
        </MapView>
      )}
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
  map: {
    width: 200,
    height: 200,
  },
});
