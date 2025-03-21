import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { useCart } from "@/context/CartProvider";
import {} from "react-native";
import { useRouter } from "expo-router";
import { useOrder } from "@/hooks/useOrder";
const CartScreen = () => {
  const { cart, handleAddToCart, handleRemoveFromCart } = useCart();

  const [cartItems, setCartItems] = useState<any[]>([]);

  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const getCartItems = () => {
      setCartItems(cart);
      const totalAmount = cart.reduce(
        (acc, item) =>
          acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      );
      console.log(cart);
      setTotal(totalAmount);
    };
    getCartItems();
  }, [cart]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text onPress={() => router.back()} style={styles.backButton}>
          ←
        </Text>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.editText}>EDIT ITEMS</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
              <Text style={styles.itemSize}>{item.size}</Text>
            </View>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  if (item.quantity === 1) {
                    Alert.alert(
                      "Remove Item",
                      "Are you sure you want to remove this item from the cart?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Remove",
                          style: "destructive",
                          onPress: () => handleRemoveFromCart(item.id),
                        },
                      ]
                    );
                  } else {
                    handleRemoveFromCart(item.id);
                  }
                }}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleAddToCart({ ...item, quantity: 1 })}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.addressSection}>
        <Text style={styles.addressLabel}>DELIVERY ADDRESS</Text>
        <Text style={styles.editAddress}>EDIT</Text>
        <TextInput
          style={styles.addressText}
          value="2118 Thornridge Cir. Syracuse"
        />
      </View>

      {/* Total and Button */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>TOTAL:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          <Text style={styles.breakdownText}>Breakdown</Text>
        </View>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>PLACE ORDER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141421",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  editText: {
    color: "#FF8C00",
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#1C1C27",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemPrice: {
    color: "#fff",
    marginTop: 5,
  },
  itemSize: {
    color: "#ccc",
    fontSize: 12,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#FF8C00",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  quantity: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 10,
  },
  addressSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addressLabel: {
    color: "#888",
    fontSize: 12,
  },
  editAddress: {
    color: "#FF8C00",
    fontWeight: "bold",
    position: "absolute",
    right: 15,
    top: 15,
  },
  addressText: {
    marginTop: 5,
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  breakdownText: {
    color: "#FF8C00",
    fontWeight: "bold",
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 18,
  },
  orderButton: {
    backgroundColor: "#FF8C00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
