import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import HeaderBar from "@/components/HeaderBar";

import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { UserProfile } from "@/types";
import Search from "@/components/Search";
import Categories from "@/components/Categories";
export default function TabOneScreen() {
  const [currentUser, setCurrentUser] = useState<UserProfile>();
  const router = useRouter();
  const { authState } = useAuth();
  useEffect(() => {
    if (!authState.token || !authState.user) {
      router.replace("/login");
      return;
    }
    setCurrentUser(authState.user);
  }, [authState]);

  return (
    <View style={styles.container}>
      <HeaderBar />
      <Text style={styles.title}>
        Hey {currentUser?.username}, Good Afternoon!
      </Text>
      <Search />
      <Categories />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
