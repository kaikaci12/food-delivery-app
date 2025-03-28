import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import HeaderBar from "@/components/HeaderBar";
import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { UserProfile } from "@/types";
import Search from "@/components/Search";

import { useCart } from "@/context/CartProvider";
import LogOut from "@/components/LogOut";

import { useOrder } from "@/hooks/useOrder";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const router = useRouter();
  const { authState } = useAuth();
  const { handleAddToCart } = useCart();
  const { order } = useOrder();

  useEffect(() => {
    if (authState.token && authState.user) {
      setCurrentUser(authState.user);
    }
  }, [authState]);
  useEffect(() => {
    if (order) {
      setShowTrackingModal(true);
    }
  }, [order]);
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        const foodItemsList = data.products.filter(
          (item: any) => item.category === "groceries"
        );

        setFoodItems(foodItemsList); // Store the full list
        setFilteredFoodItems(foodItemsList); // Initialize filtered list
      } catch (error) {
        console.log("Error fetching food items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredFoodItems(foodItems);
    } else {
      const filtered = foodItems.filter((item: any) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFoodItems(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar setShowModal={setShowModal} showModal={showModal} />
      <Text style={styles.title}>
        Hey {currentUser?.username}, Good Afternoon!
      </Text>
      <Search handleSearch={handleSearch} />

      {loading ? (
        <ActivityIndicator color={"red"} size={40} />
      ) : (
        <FlatList
          data={filteredFoodItems}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }: any) => (
            <View style={styles.card}>
              <Link href={`/meal/${item.id}` as any}>
                <Image source={{ uri: item.thumbnail }} style={styles.image} />

                <Text style={styles.name}>{item.title}</Text>
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
              <Text style={styles.price}>${item.price}</Text>
            </View>
          )}
        />
      )}

      {order || showTrackingModal ? (
        <View style={styles.trackOrderContainer}>
          <Text style={styles.trackText}>
            You have items ordered. Want to track your order?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => router.replace("/track")}
            >
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowTrackingModal(false)}
            >
              <Text style={styles.secondaryButtonText}>No thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : order && !showTrackingModal ? (
        <TouchableOpacity
          style={[
            styles.trackButton,
            { position: "absolute", right: 10, top: 100 },
          ]}
          onPress={() => router.replace("/track")}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
      ) : null}
      {showModal && <LogOut />}
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
  /* Track Order Section */

  trackText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  // Removed duplicate trackButton definition
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  blurView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  trackingImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  modalStatus: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFA500",
    marginVertical: 15,
  },
  closeButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  trackOrderContainer: {
    flexDirection: "column",
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    width: "100%",
  },
  trackButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  trackButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
});
