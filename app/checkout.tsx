import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartProvider";
import { useOrder } from "@/hooks/useOrder";
import { useLocalSearchParams } from "expo-router";
const paymentMethods = [
  { id: "cash", name: "Cash", icon: "cash-outline" },
  { id: "visa", name: "Visa", icon: "card-outline" },
  { id: "mastercard", name: "Mastercard", icon: "card-outline" },
  { id: "paypal", name: "PayPal", icon: "logo-paypal" },
];

const savedCards = [
  { id: "1", type: "Mastercard", last4: "4367" },
  { id: "2", type: "Visa", last4: "1234" },
];

const CheckoutScreen = () => {
  const { address } = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const { saveOrder, error, loading } = useOrder();
  const { calculateTotal, cart, handleClearCart } = useCart();
  const [selectedCard, setSelectedCard] = useState(savedCards[0]?.id || null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const totalAmount = calculateTotal();
    setCartItems(cart);
    setTotal(totalAmount);
  }, [cart]);

  const handlePayment = async () => {
    if (selectedMethod === "visa" || selectedMethod === "mastercard") {
      if (!selectedCard) {
        Alert.alert("Error", "Please select a card.");
        return;
      }
    }

    let orderAddress = null;
    if (address) {
      try {
        orderAddress = JSON.parse(decodeURIComponent(address as string));
      } catch (error) {
        console.error("Error parsing order address:", error);
      }
    }

    setIsProcessing(true);

    try {
      await saveOrder({
        id: Math.random().toString(36).substring(7), // Generate a random order ID
        items: cartItems,
        total,
        orderAddress: orderAddress || {
          street: "Unknown",
          city: "Unknown",
          location: { latitude: 0, longitude: 0 },
        },
      });

      console.log("Order placed successfully:", {
        id: Math.random().toString(36).substring(7),
        items: cartItems,
        total,
        orderAddress: orderAddress || {
          street: "Unknown",
          city: "Unknown",
          location: { latitude: 0, longitude: 0 },
        },
      });
      handleClearCart();
      Alert.alert("Success", "Your order has been placed successfully!", [
        {
          text: "Track my Order",
          onPress: () => {
            router.replace("/track");
          },
        },
      ]);
    } catch (error: any) {
      console.error("Order placement error:", error);
      Alert.alert("Error", error.message || "Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Payment Method Selection */}
      <Text style={styles.sectionTitle}>Select Payment Method</Text>
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
            <Ionicons
              name={item.icon as any}
              size={24}
              color={selectedMethod === item.id ? "#FF6B00" : "#000"}
            />
            <Text
              style={[
                styles.methodText,
                selectedMethod === item.id && styles.selectedMethodText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.paymentMethodContainer}
      />

      {/* Saved Card Selection */}
      {(selectedMethod === "visa" || selectedMethod === "mastercard") && (
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Select Card</Text>
          {savedCards.length > 0 ? (
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
              rowStyle={styles.dropdownRow}
              rowTextStyle={styles.dropdownRowText}
            />
          ) : (
            <Text style={styles.noCardsText}>No saved cards available.</Text>
          )}

          {/* Add New Card */}
          <TouchableOpacity style={styles.addNewButton}>
            <Text style={styles.addNewText}>+ ADD NEW CARD</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Total & Confirm Button */}
      <Text style={styles.totalText}>TOTAL: ${total}</Text>
      <TouchableOpacity
        onPress={handlePayment}
        style={styles.confirmButton}
        disabled={isProcessing || (selectedMethod !== "cash" && !selectedCard)}
      >
        {isProcessing ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.confirmText}>PAY & CONFIRM</Text>
        )}
      </TouchableOpacity>

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentMethod: {
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
    marginRight: 10,
    width: 100,
  },
  selectedMethod: {
    borderColor: "#FF6B00",
    backgroundColor: "#FFEDE0",
  },
  methodText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  selectedMethodText: {
    color: "#FF6B00",
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
    color: "#333",
  },
  dropdownRow: {
    backgroundColor: "#FFF",
    borderBottomColor: "#E5E7EB",
  },
  dropdownRowText: {
    fontSize: 16,
    color: "#333",
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
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#FF6B00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  noCardsText: {
    color: "gray",
    textAlign: "center",
    marginVertical: 10,
  },
});
