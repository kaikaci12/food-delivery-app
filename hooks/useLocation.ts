import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

type LocationData = {
  location: Location.LocationObject | null;
  city: string | null;
  street: string | null;
  errorMsg: string | null;
};

export const useLocation = () => {
  const [locationData, setLocationData] = useState<LocationData>({
    location: null,
    city: null,
    street: null,
    errorMsg: null,
  });
  const [loading, setLoading] = useState(false);

  // 🏗 Load saved location when component mounts
  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const savedData = await AsyncStorage.getItem("locationData");
      if (savedData) {
        setLocationData(JSON.parse(savedData));
      }
    } catch (error) {
      console.log("Failed to load saved location:", error);
    }
  };

  const requestLocation = async () => {
    setLoading(true);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationData((prev) => ({
        ...prev,
        errorMsg: "Location permission is required.",
      }));
      setLoading(false);
      return;
    }

    try {
      let userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        mayShowUserSettingsDialog: true,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });

      const updatedData: LocationData = {
        location: userLocation,
        city: address[0]?.city || "Unknown City",
        street: address[0]?.street || "",
        errorMsg: null,
      };

      setLocationData(updatedData);
      await AsyncStorage.setItem("locationData", JSON.stringify(updatedData));
    } catch (error) {
      setLocationData((prev) => ({
        ...prev,
        errorMsg: "Unable to retrieve location.",
      }));
    }

    setLoading(false);
  };

  return { ...locationData, loading, requestLocation };
};
