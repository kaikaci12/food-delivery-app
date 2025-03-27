import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { LocationContext } from "./LocationContext";

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);

  const [city, setCity] = useState<string | null>(null);
  const [street, setStreet] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    checkPermission();
    loadSavedLocation();
    checkLocationServices();
    return () => stopTracking();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermissionGranted(status === "granted");
  };
  const checkLocationServices = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      setLocationEnabled(enabled);
    } catch (error) {
      console.error("Error checking location services:", error);
    }
  };

  const loadSavedLocation = async () => {
    try {
      const savedData = await AsyncStorage.getItem("locationData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setLocation(parsedData.location);
        setCity(parsedData.city);
        setStreet(parsedData.street);
      }
    } catch (error) {
      console.log("Failed to load saved location:", error);
    }
  };

  const requestLocation = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPermissionGranted(false);
      setErrorMsg("Location permission is required.");
      setLoading(false);
      return;
    }
    setPermissionGranted(true);

    try {
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const address = await Location.reverseGeocodeAsync(userLocation.coords);

      if (!address || address.length === 0) {
        setErrorMsg("Unable to retrieve address.");
        setLoading(false);
        return;
      }

      const newCity = address[0]?.city || "Unknown City";
      const newStreet = address[0]?.street || "";

      // Prevent unnecessary re-renders
      if (
        location?.coords.latitude !== userLocation.coords.latitude ||
        location?.coords.longitude !== userLocation.coords.longitude
      ) {
        setLocation(userLocation);
        setCity(newCity);
        setStreet(newStreet);
        setErrorMsg(null);

        await AsyncStorage.setItem(
          "locationData",
          JSON.stringify({
            location: userLocation,
            city: newCity,
            street: newStreet,
          })
        );
      }
    } catch (error) {
      setErrorMsg("Unable to retrieve location.");
    }
    setLoading(false);
  };

  const startTracking = async () => {
    if (tracking) return;

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPermissionGranted(false);
      setErrorMsg("Location permission is required.");
      return;
    }

    setPermissionGranted(true);
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 2000,
        distanceInterval: 2,
      },
      async (userLocation) => {
        const address = await Location.reverseGeocodeAsync(userLocation.coords);

        if (!address || address.length === 0) {
          setErrorMsg("Unable to retrieve address.");
          return;
        }

        const newCity = address[0]?.city || "Unknown City";
        const newStreet = address[0]?.street || "";

        // Prevent unnecessary re-renders
        if (
          location?.coords.latitude !== userLocation.coords.latitude ||
          location?.coords.longitude !== userLocation.coords.longitude
        ) {
          setLocation(userLocation);
          setCity(newCity);
          setStreet(newStreet);

          await AsyncStorage.setItem(
            "locationData",
            JSON.stringify({
              location: userLocation,
              city: newCity,
              street: newStreet,
            })
          );
        }
      }
    );

    setSubscription(sub);
    setTracking(true);
  };

  const stopTracking = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setTracking(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        city,
        street,
        errorMsg,
        permissionGranted,
        loading,
        tracking,
        requestLocation,
        startTracking,
        stopTracking,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Custom Hook to use Location Context
export const useLocation = () => useContext(LocationContext);
