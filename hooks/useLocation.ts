import { useState } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    } catch (error) {
      setErrorMsg("Unable to retrieve location.");
    }

    setLoading(false);
  };

  return { location, errorMsg, loading, requestLocation };
};
