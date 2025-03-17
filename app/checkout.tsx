import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartProvider";
import { useOrder } from "@/hooks/useOrder";
const paymentMethods = [
  { id: "cash", name: "Cash", icon: "cash-outline" },
  { id: "visa", name: "Visa", icon: "card-outline" },
  { id: "mastercard", name: "Mastercard", icon: "card-outline" },
  { id: "paypal", name: "PayPal", icon: "logo-paypal" },
];

const savedCards = [
  { id: "1", type: "Mastercard", last4: "436" },
  { id: "2", type: "Visa", last4: "1234" },
];

const CheckoutScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const { saveOrder, error, loading } = useOrder();
  const { calculateTotal, cart } = useCart();
  const [selectedCard, setSelectedCard] = useState(savedCards[0].id);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadingIngOrder, setLoadingIngOrder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const totalAmount = calculateTotal();
    setCartItems(cart);
    setTotal(totalAmount);
    setLoadingIngOrder(loading);
  }, []);
  const handlePaymant = () => {
    saveOrder({
      id: "1",
      items: cartItems,
      total,
    });
    router.replace("/track");
  };
  return (
    <View style={styles.container}>
      {/* Payment Method Selection */}
      <View style={styles.paymentMethodContainer}>
        <FlatList
          horizontal
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedMethod === item.id && styles.selectedMethod,
              ]}
              onPress={() => setSelectedMethod(item.id)}
            >
              <Ionicons name={item.icon as any} size={24} color="black" />
              <Text style={styles.methodText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Saved Card Selection */}
      {(selectedMethod === "visa" || selectedMethod === "mastercard") && (
        <View style={styles.cardContainer}>
          <SelectDropdown
            data={savedCards}
            defaultValue={savedCards.find((card) => card.id === selectedCard)}
            onSelect={(selectedItem: any) => setSelectedCard(selectedItem.id)}
            buttonTextAfterSelection={(selectedItem: any) =>
              `${selectedItem.type} **** ${selectedItem.last4}`
            }
            rowTextForSelection={(item: any) =>
              `${item.type} **** ${item.last4}`
            }
            buttonStyle={styles.dropdownButton}
            buttonTextStyle={styles.dropdownButtonText}
          />

          {/* Add New Card */}
          <TouchableOpacity style={styles.addNewButton}>
            <Text style={styles.addNewText}>+ ADD NEW</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Total & Confirm Button */}
      <Text style={styles.totalText}>TOTAL: ${total}</Text>
      <TouchableOpacity onPress={handlePaymant} style={styles.confirmButton}>
        <Text style={styles.confirmText}>PAY & CONFIRM</Text>
      </TouchableOpacity>
      {loadingIngOrder && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  paymentMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  paymentMethod: {
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
    marginRight: 10,
  },
  selectedMethod: {
    borderColor: "#FF6B00",
    backgroundColor: "#FFEDE0",
  },
  methodText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  cardContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dropdownButton: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    textAlign: "left",
  },
  addNewButton: {
    marginTop: 10,
    alignItems: "center",
  },
  addNewText: {
    color: "#FF6B00",
    fontSize: 16,
    fontWeight: "600",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#FF6B00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
