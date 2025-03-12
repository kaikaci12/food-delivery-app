import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { usePathname } from "expo-router";

const Meal = () => {
  const { id } = usePathname();
  const [loading, setLoading] = useState(true);
  const [foodData, setFoodData] = useState<any>([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("https://dummyjson.com/recipes");
        const data = await response.json();
        const filteredData = data.recipes.find((item): any => item.id == id);
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
      <Image source={{ uri: foodData.image }} style={styles.image} />
      <Text style={styles.title}>{foodData.name}</Text>
      <Text style={styles.subText}>{foodData.category}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.rating}>⭐ {foodData.rating}</Text>
        <Text style={styles.delivery}>🚚 {foodData.deliverytime}</Text>
      </View>
      <View style={styles.sizeContainer}>
        <TouchableOpacity style={styles.sizeButton}>
          <Text>10"</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sizeButton, styles.selectedSize]}>
          <Text>14"</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sizeButton}>
          <Text>16"</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.price}>${foodData.price}</Text>
      <TouchableOpacity style={styles.cartButton}>
        <Text style={styles.cartText}>ADD TO CART</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20, backgroundColor: "#FFF" },
  image: { width: 200, height: 200, borderRadius: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  subText: { color: "gray" },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 10,
  },
  rating: { fontSize: 16 },
  delivery: { fontSize: 16 },
  sizeContainer: { flexDirection: "row", marginVertical: 10 },
  sizeButton: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedSize: { backgroundColor: "#FFA500", borderColor: "#FFA500" },
  price: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  cartButton: { backgroundColor: "#FFA500", padding: 15, borderRadius: 5 },
  cartText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { textAlign: "center", marginTop: 20, fontSize: 18, color: "red" },
});

export default Meal;
