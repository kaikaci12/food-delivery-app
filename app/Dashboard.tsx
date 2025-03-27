import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import HeaderBar from "@/components/HeaderBar";
import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { UserProfile } from "@/types";
import Search from "@/components/Search";
import Categories from "@/components/Categories";
import { useCart } from "@/context/CartProvider";
import LogOut from "@/components/LogOut";
import LoadingAnimation from "@/components/Loading";
import { BlurView } from "expo-blur";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const { authState } = useAuth();
  const { handleAddToCart } = useCart();

  useEffect(() => {
    if (authState.token && authState.user) {
      setCurrentUser(authState.user);
    }
  }, [authState]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        setFoodItems(data.products);
        setFilteredFoodItems(data.products);
      } catch (error) {
        console.log("Error fetching food items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, []);

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
      {showModal && <LogOut />}
      <HeaderBar setShowModal={setShowModal} showModal={showModal} />
      <Text style={styles.title}>
        Hey {currentUser?.username}, Good Afternoon!
      </Text>
      <Search handleSearch={handleSearch} />
      <Categories
        handleCategory={handleCategory}
        setActive={setCategory}
        active={category}
      />
      {loading ? (
        <LoadingAnimation />
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
                <Text style={styles.location}>{item.category}</Text>
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
      )}

      {/* Track Order Section */}
      <View style={styles.trackOrderContainer}>
        <Text style={styles.trackText}>Wanna track your order?</Text>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => setShowTrackingModal(true)}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
      </View>

      {/* Tracking Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showTrackingModal}
        onRequestClose={() => setShowTrackingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} style={styles.blurView}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Order Tracking</Text>
              <Text style={styles.modalSubtitle}>
                Your order is on the way 🚀
              </Text>

              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/7702/7702470.png",
                }}
                style={styles.trackingImage}
              />

              <Text style={styles.modalStatus}>Estimated Time: 15 min</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTrackingModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
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
  trackOrderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  trackText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  trackButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  trackButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
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
});
