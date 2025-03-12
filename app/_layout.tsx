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
import { StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
export { ErrorBoundary } from "expo-router";

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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { authState } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!authState.token && !authState.user) {
      router.replace("/Dashboard");
    } else {
      router.replace("/Dashboard");
    }
  }, [authState.token, router]);
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="location" options={{ headerShown: false }} />
          <Stack.Screen name="meal" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
