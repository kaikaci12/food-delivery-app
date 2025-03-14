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
import { ActivityIndicator, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
export { ErrorBoundary } from "expo-router";
import { CartProvider } from "@/context/CartProvider";
import LoadingAnimation from "@/components/Loading";

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();
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
    SplashScreen.preventAutoHideAsync();
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Ensure nothing renders until fonts are loaded
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { authState, loading } = useAuth(); // Add loading state from useAuth
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!loading) {
      if (!authState.token && !authState.user) {
        router.replace("/");
      } else {
        router.replace("/Dashboard"); // Redirect to Dashboard if authenticated
      }
    }
  }, [authState.token, authState.user, loading, router]);

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
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </CartProvider>
    </ThemeProvider>
  );
}
