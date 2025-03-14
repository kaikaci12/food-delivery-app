import { useState, useEffect } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load saved location on startup
  useEffect(() => {
    const loadStoredLocation = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem("userLocation");
        if (storedLocation) {
          setLocation(JSON.parse(storedLocation));
        }
      } catch (error) {
        console.error("Failed to load stored location:", error);
      }
    };
    loadStoredLocation();
  }, []);

  const requestLocation = async () => {
    setLoading(true);
    setErrorMsg(null);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Location permission is required.");
      setLoading(false);
      return;
    }

    try {
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
      await AsyncStorage.setItem("userLocation", JSON.stringify(userLocation)); // Save to storage
    } catch (error) {
      setErrorMsg("Unable to retrieve location.");
    }

    setLoading(false);
  };

  return { location, errorMsg, loading, requestLocation };
};
