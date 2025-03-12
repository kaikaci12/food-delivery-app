import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useCart } from "@/context/CartProvider";

const CartScreen = () => {
  const { cart } = useCart();
  const [cartItems, setCartItems] = useState<any[]>([]);
  useEffect(() => {
    const getCartItems = async () => {
      setCartItems(cart);
    };
    getCartItems();
  }, [cart]);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.backButton}>←</Text>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.editText}>EDIT ITEMS</Text>
      </View>

      {/* Cart Items */}
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
              <TouchableOpacity style={styles.quantityButton}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity style={styles.quantityButton}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.addressSection}>
        <Text style={styles.addressLabel}>DELIVERY ADDRESS</Text>
        <Text style={styles.editAddress}>EDIT</Text>
        <Text style={styles.addressText}>2118 Thornridge Cir. Syracuse</Text>
      </View>

      {/* Total and Button */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>TOTAL:</Text>
          <Text style={styles.breakdownText}>Breakdown</Text>
          <Text style={styles.totalAmount}>$96</Text>
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
