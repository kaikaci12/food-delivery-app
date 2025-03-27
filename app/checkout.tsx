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

const TAX_RATE = 0.08; // 8% tax
const DELIVERY_FEE = 5.99; // Fixed delivery fee

const CheckoutScreen = () => {
  const { address } = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const { saveOrder, error, loading } = useOrder();
  const { calculateTotal, cart, handleClearCart } = useCart();
  const [selectedCard, setSelectedCard] = useState(savedCards[0]?.id || null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Calculate order values
  const subtotal = calculateTotal();
  const tax = subtotal * TAX_RATE;
  const delivery = subtotal > 50 ? 0 : DELIVERY_FEE; // Free delivery for orders over $50
  const total = subtotal + tax + delivery;

  useEffect(() => {
    setCartItems(cart);
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
          text: "Continue Shopping",
          onPress: () => router.replace("/"),
        },
        {
          text: "Track Order",
          onPress: () => router.replace("/track"),
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Payment Method Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text style={styles.sectionSubtitle}>
          Choose your preferred payment option
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
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
              <View style={styles.methodIconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={selectedMethod === item.id ? "#FF6B00" : "#6B7280"}
                />
              </View>
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
      </View>

      {/* Saved Card Selection */}
      {(selectedMethod === "visa" || selectedMethod === "mastercard") && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          <Text style={styles.sectionSubtitle}>
            Select or add a payment card
          </Text>

          <View style={styles.cardContainer}>
            {savedCards.length > 0 ? (
              <SelectDropdown
                data={savedCards}
                defaultValueByIndex={savedCards.findIndex(
                  (card) => card.id === selectedCard
                )}
                onSelect={(selectedItem: any) =>
                  setSelectedCard(selectedItem.id)
                }
                buttonTextAfterSelection={(selectedItem: any) =>
                  `${selectedItem.type} •••• ${selectedItem.last4}`
                }
                rowTextForSelection={(item: any) =>
                  `${item.type} •••• ${item.last4}`
                }
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.dropdownButtonText}
                rowStyle={styles.dropdownRow}
                rowTextStyle={styles.dropdownRowText}
                renderDropdownIcon={() => (
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                )}
              />
            ) : (
              <View style={styles.noCardsContainer}>
                <Ionicons name="card-outline" size={24} color="#9CA3AF" />
                <Text style={styles.noCardsText}>No saved cards available</Text>
              </View>
            )}

            {/* Add New Card */}
            <TouchableOpacity style={styles.addNewButton} onPress={() => {}}>
              <Ionicons name="add-circle-outline" size={20} color="#FF6B00" />
              <Text style={styles.addNewText}>Add New Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Order Summary */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax ({TAX_RATE * 100}%)</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>
            {delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handlePayment}
          style={[
            styles.confirmButton,
            (isProcessing || (selectedMethod !== "cash" && !selectedCard)) &&
              styles.disabledButton,
          ]}
          disabled={
            isProcessing || (selectedMethod !== "cash" && !selectedCard)
          }
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Text style={styles.confirmText}>Confirm Payment</Text>
              <Text style={styles.confirmAmount}>${total.toFixed(2)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={20} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  paymentMethodContainer: {
    paddingVertical: 8,
  },
  paymentMethod: {
    alignItems: "center",
    padding: 16,
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
    marginRight: 12,
    width: 110,
  },
  selectedMethod: {
    borderColor: "#FF6B00",
    backgroundColor: "#FFF8F1",
  },
  methodIconContainer: {
    marginBottom: 8,
  },
  methodText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  selectedMethodText: {
    color: "#FF6B00",
    fontWeight: "600",
  },
  cardContainer: {
    marginTop: 8,
  },
  dropdownButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  dropdownButtonText: {
    fontSize: 16,
    textAlign: "left",
    color: "#111827",
  },
  dropdownRow: {
    backgroundColor: "#FFF",
    borderBottomColor: "#E5E7EB",
    height: 50,
  },
  dropdownRowText: {
    fontSize: 16,
    color: "#111827",
    paddingHorizontal: 16,
  },
  noCardsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    marginBottom: 12,
  },
  noCardsText: {
    color: "#6B7280",
    marginLeft: 8,
    fontSize: 14,
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF6B00",
    backgroundColor: "#FFF8F1",
  },
  addNewText: {
    color: "#FF6B00",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalRow: {
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "700",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 16,
  },
  confirmButton: {
    backgroundColor: "#FF6B00",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
    shadowColor: "transparent",
  },
  confirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmAmount: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
});
