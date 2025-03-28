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
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useCart } from "@/context/CartProvider";

const Meal = () => {
  const { id } = useLocalSearchParams();
  const { handleAddToCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#FFA500" style={styles.loader} />
    );
  }

  if (!product) {
    return <Text style={styles.errorText}>Product not found</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Image source={{ uri: product.thumbnail }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.detailsRow}>
        <Text style={styles.rating}>
          <AntDesign name="star" size={16} color="orange" />{" "}
          {product.rating || "N/A"}
        </Text>
        <Text style={styles.stock}>
          <FontAwesome5 name="box" size={16} color="orange" />{" "}
          {product.availabilityStatus}
        </Text>
        <Text style={styles.delivery}>
          <AntDesign name="clockcircle" size={16} color="orange" />{" "}
          {product.shippingInformation || "Ships soon"}
        </Text>
      </View>

      <Text style={styles.price}>${product.price}</Text>
      <TouchableOpacity
        onPress={async () => {
          try {
            await handleAddToCart(product);
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
  description: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginVertical: 10,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 10,
  },
  rating: { fontSize: 16, flexDirection: "row", alignItems: "center" },
  stock: { fontSize: 16, flexDirection: "row", alignItems: "center" },
  delivery: { fontSize: 16, flexDirection: "row", alignItems: "center" },
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
