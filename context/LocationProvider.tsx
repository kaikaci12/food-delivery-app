import React, { useState, useEffect, useContext } from "react";
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

  useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    checkPermission();
    loadSavedLocation();
    checkLocationServices();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermissionGranted(status === "granted");
  };
  const checkLocationServices = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      setLocationEnabled(enabled);
      console.log("Location enabled: ", enabled);
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
    } catch (error: any) {
      setErrorMsg(error);
    }
    setLoading(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        city,
        street,
        errorMsg,
        permissionGranted,
        checkLocationServices,
        locationEnabled,
        loading,

        requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Custom Hook to use Location Context
export const useLocation = () => useContext(LocationContext);
