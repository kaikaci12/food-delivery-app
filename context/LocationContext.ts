import * as Location from "expo-location";
import { createContext } from "react";

type LocationContextType = {
  location: Location.LocationObject | null;
  city: string | null;
  street: string | null;
  errorMsg: string | null;
  permissionGranted: boolean | null;
  checkLocationServices: () => Promise<void>;
  locationEnabled: boolean | null;
  loading: boolean;
  tracking: boolean;
  requestLocation: () => Promise<void>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
};

// Default values for the context
export const LocationContext = createContext<LocationContextType>({
  location: null,
  city: null,
  street: null,
  errorMsg: null,
  checkLocationServices: async () => {},
  locationEnabled: false,
  permissionGranted: null,
  loading: false,
  tracking: false,
  requestLocation: async () => {},
  startTracking: async () => {},
  stopTracking: () => {},
});
