import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useCart } from "@/context/CartProvider";

const Meal = () => {
  const { id } = useLocalSearchParams();
  const { cart, handleAddToCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [foodData, setFoodData] = useState<any>([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch(
          "https://dummyjson.com/c/479f-e93b-4cd5-9b07"
        );
        const data = await response.json();
        const filteredData = data.find((item: { id: string }) => item.id == id);
        setFoodData(filteredData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#FFA500" style={styles.loader} />
    );
  }

  if (!foodData) {
    return <Text style={styles.errorText}>Food item not found</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Image source={{ uri: foodData.image }} style={styles.image} />
      <Text style={styles.title}>{foodData.name}</Text>

      <View style={styles.detailsRow}>
        <Text style={styles.rating}>
          <AntDesign name="star" size={16} color="orange" /> {foodData.rating}
        </Text>
        <Text style={styles.rating}>
          <FontAwesome5 name="truck" size={16} color="orange" /> Free
        </Text>
        <Text style={styles.delivery}>
          <AntDesign name="clockcircle" size={16} color="orange" />{" "}
          {foodData.deliverytime}
        </Text>
      </View>

      <Text style={styles.price}>${foodData.price}</Text>
      <TouchableOpacity
        onPress={async () => {
          try {
            await handleAddToCart(foodData);
            alert("Item added to cart");
          } catch (error) {
            console.log(error);
          }
        }}
        style={styles.cartButton}
      >
        <Text style={styles.cartText}>ADD TO CART</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20, backgroundColor: "#FFF" },
  backButton: { position: "absolute", top: 20, left: 20, zIndex: 1 },
  image: { width: 220, height: 220, borderRadius: 15, marginVertical: 10 },
  title: { fontSize: 26, fontWeight: "bold", marginVertical: 5 },
  subText: { color: "gray", fontSize: 16 },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 10,
  },
  rating: { fontSize: 16, flexDirection: "row", alignItems: "center" },
  delivery: { fontSize: 16, flexDirection: "row", alignItems: "center" },
  sizeContainer: { flexDirection: "row", marginVertical: 10 },
  sizeButton: {
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  selectedSize: { backgroundColor: "#FFA500", borderColor: "#FFA500" },
  price: { fontSize: 26, fontWeight: "bold", marginVertical: 10 },
  cartButton: {
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  cartText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { textAlign: "center", marginTop: 20, fontSize: 18, color: "red" },
});

export default Meal;
