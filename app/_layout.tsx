import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import AuthProvider from "@/context/AuthProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { ActivityIndicator, Alert, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartProvider";
import { LocationProvider } from "@/context/LocationProvider";
import NetInfo from "@react-native-community/netinfo";
import * as Updates from "expo-updates";
import { useLocation } from "@/context/LocationProvider";
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync(); // Keep only one call

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Sen-Regular": require("../assets/fonts/Sen-Regular.ttf"),
    "Sen-Bold": require("../assets/fonts/Sen-Bold.ttf"),
    "Sen-ExtraBold": require("../assets/fonts/Sen-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        Alert.alert("Please Connect to the Internet", "Connect and try again", [
          {
            text: "Reload app",
            onPress: async () => await Updates.reloadAsync(),
          },
        ]);
      }
    });

    return () => unsubscribe();
  }, []);
  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <LocationProvider>
        <RootLayoutNav />
      </LocationProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { authState, loading } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { permissionGranted } = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!authState.token || !authState.user) {
        router.replace("/login");
      } else if (permissionGranted === false) {
        router.replace("/location");
      } else {
        router.replace("/Dashboard");
      }
    }
  }, [authState?.token, authState?.user, permissionGranted, loading, router]);

  // Ensure app is fully loaded before rendering
  if (loading || authState === null || permissionGranted === undefined) {
    return <ActivityIndicator />; // Prevents rendering and navigation until data is available
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="location" options={{ headerShown: false }} />
          <Stack.Screen name="meal/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="track" options={{ headerShown: false }} />
          <StatusBar hidden />
        </Stack>
      </CartProvider>
    </ThemeProvider>
  );
}
