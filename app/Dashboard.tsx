import { StyleSheet, Text, View, Image } from "react-native";

import HeaderBar from "@/components/HeaderBar";

import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { UserProfile } from "@/types";
import Search from "@/components/Search";
import Categories from "@/components/Categories";
export default function TabOneScreen() {
  const [currentUser, setCurrentUser] = useState<UserProfile>();
  const [foodItems, setFoodItems] = useState([]);
  const router = useRouter();
  const { authState } = useAuth();
  useEffect(() => {
    if (!authState.token || !authState.user) {
      router.replace("/login");
      return;
    }
    setCurrentUser(authState.user);
  }, [authState]);
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch(
          "https://dummyjson.com/c/479f-e93b-4cd5-9b07"
        );
        const data = await response.json();
        setFoodItems(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFoodItems();
  }, [authState]);

  return (
    <View style={styles.container}>
      <HeaderBar />
      <Text style={styles.title}>
        Hey {currentUser?.username}, Good Afternoon!
      </Text>
      <Search />
      <Categories />
      {foodItems.map((item: any, index: number) => (
        <View key={index}>
          <Text>{item.name}</Text>
          <Image src={item.image} />
        </View>
      ))}
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
