import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";

const HeaderBar = () => {
  const [cartItems, setCartItems] = useState(null);
  return (
    <View style={styles.container}>
      {/* Menu Icon */}
      <TouchableOpacity style={styles.menuButton}>
        <Feather name="menu" size={20} color="black" />
      </TouchableOpacity>

      {/* Delivery Info */}
      <View style={styles.deliveryInfo}>
        <Text style={styles.label}>DELIVER TO</Text>
        <View style={styles.locationRow}>
          <Text style={styles.locationText}>Halal Lab office</Text>
          <Feather name="chevron-down" size={18} color="black" />
        </View>
      </View>

      <TouchableOpacity style={styles.cartContainer}>
        <View style={styles.cartIcon}>
          <Feather name="shopping-bag" size={22} color="white" />
        </View>
        {cartItems && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "white",
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#F58025",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
  },
  cartContainer: {
    position: "relative",
  },
  cartIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#10182F",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#FF6720",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});

export default HeaderBar;
