import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import HeaderBar from "@/components/HeaderBar";
import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { UserProfile } from "@/types";
import Search from "@/components/Search";
import Categories from "@/components/Categories";
import { useCart } from "@/context/CartProvider";
import LoadingAnimation from "@/components/Loading";
export default function TabOneScreen() {
  const [currentUser, setCurrentUser] = useState<UserProfile>();
  const [foodItems, setFoodItems] = useState([]);

  const [filteredFoodItems, setFilteredFoodItems] = useState([]); // Keep original data
  const [category, setCategory] = useState("All");
  const router = useRouter();
  const { authState, loading } = useAuth();
  const { handleAddToCart } = useCart();

  useEffect(() => {
    if (loading) return; // Wait until loading is finished

    if (!authState.token || !authState.user) {
      console.log("current user not found");

      return;
    }

    setCurrentUser(authState.user);
  }, [authState, loading]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch(
          "https://dummyjson.com/c/479f-e93b-4cd5-9b07"
        );
        const data = await response.json();
        setFoodItems(data);
        setFilteredFoodItems(data); // Store original data
      } catch (error) {
        console.log(error);
      }
    };
    fetchFoodItems();
  }, [authState]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredFoodItems(foodItems);
    } else {
      setFilteredFoodItems(
        foodItems.filter((item: any) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleCategory = (categoryName: string) => {
    console.log(categoryName);
    setCategory(categoryName);
    if (categoryName === "All") {
      setFilteredFoodItems(foodItems);
    } else {
      setFilteredFoodItems(
        foodItems.filter(
          (item: any) =>
            item.category.toLowerCase() === categoryName.toLowerCase()
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar />
      <Text style={styles.title}>
        Hey {currentUser?.username}, Good Afternoon!
      </Text>
      <Search handleSearch={handleSearch} />
      <Categories
        handleCategory={handleCategory}
        setActive={setCategory}
        active={category}
      />

      <FlatList
        data={filteredFoodItems}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Link href={`/meal/${item.id}` as any}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </Link>

            <TouchableOpacity
              onPress={async () => {
                await handleAddToCart(item);

                alert("Added to cart");
              }}
              style={styles.addButton}
            >
              <AntDesign name="plus" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    margin: 8,
    flex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  location: {
    fontSize: 12,
    color: "gray",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#FFA500",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
