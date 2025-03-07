import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import Feather from "@expo/vector-icons/Feather";
import HeaderBar from "@/components/HeaderBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
export default function TabOneScreen() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  const { authState } = useAuth();
  useEffect(() => {
    if (!authState.token || !authState.user) {
      router.replace("/login");
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar />
      <Text>Hey {}, Good Afternoon!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
