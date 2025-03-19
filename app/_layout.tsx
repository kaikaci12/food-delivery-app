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
export { ErrorBoundary } from "expo-router";
import { CartProvider } from "@/context/CartProvider";
import LoadingAnimation from "@/components/Loading";
import { useLocation } from "@/hooks/useLocation";
import NetInfo from "@react-native-community/netinfo";
import RNRestart from "react-native-restart";

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
          { text: "Reload app", onPress: () => RNRestart.restart() },
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
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { authState, loading } = useAuth();
  const { location } = useLocation();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!loading) {
      if (!authState.token || !authState.user) {
        router.replace("/");
      } else if (authState.token && authState.user) {
        router.replace(location ? "/Dashboard" : "/location");
      }
    }
  }, [authState.token, authState.user, loading, location, router]);

  if (loading) {
    return <LoadingAnimation />;
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
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <StatusBar hidden />
        </Stack>
      </CartProvider>
    </ThemeProvider>
  );
}
