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

  requestLocation: () => Promise<void>;
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

  requestLocation: async () => {},
});
