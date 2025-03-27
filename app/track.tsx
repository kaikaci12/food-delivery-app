import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  Alert,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocation } from "@/context/LocationProvider";
import { useOrder } from "@/hooks/useOrder";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Order } from "@/hooks/useOrder";
import { useRouter } from "expo-router";

const TrackingScreen = () => {
  const {
    location,
    tracking,
    requestLocation,
    errorMsg,
    checkLocationServices,
    locationEnabled,
  } = useLocation();
  const { order, loading, clearOrder } = useOrder(); // Ensure clearOrder function exists
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userOrder, setUserOrder] = useState<Order | null>(null);

  const deliveryGuy = {
    name: "John Doe",
    photo:
      "https://www.vie-aesthetics.com/wp-content/uploads/2021/09/shutterstock_1877631178-600x600.jpg",
    vehicle: "bicycle",
    phoneNumber: "+995598123456",
    deliveryTime: "30 minutes",
    location: { latitude: 41.7151, longitude: 44.8271 },
  };

  useEffect(() => {
    if (location?.coords) {
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location]);

  useEffect(() => {
    if (order) {
      setUserOrder(order);
    }
  }, [order]);

  const routeCoordinates = userLocation
    ? [
        deliveryGuy.location,
        { latitude: 41.71, longitude: 44.83 },
        { latitude: 41.72, longitude: 44.84 },
        userLocation,
      ]
    : [];

  const callDeliveryGuy = () => {
    if (deliveryGuy.phoneNumber) {
      Linking.openURL(`tel:${deliveryGuy.phoneNumber.replace(/\s+/g, "")}`);
    }
  };

  const handleOrderReceived = async () => {
    try {
      await clearOrder();
      Alert.alert("Order Received", "Thank you for confirming your order!", [
        { text: "OK", onPress: () => router.replace("/Dashboard") },
      ]);
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          style={styles.map}
          region={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsBuildings
          showsCompass
          showsUserLocation={locationEnabled ?? false}
          showsMyLocationButton
        >
          <Marker coordinate={deliveryGuy.location} title="Delivery Guy">
            <View>
              <Ionicons
                name={deliveryGuy.vehicle === "bicycle" ? "bicycle" : "car"}
                size={10}
                color="red"
              />
              <Text>{deliveryGuy.deliveryTime}</Text>
            </View>
          </Marker>

          {userOrder?.orderAddress?.location && (
            <Marker
              coordinate={{
                latitude: userOrder.orderAddress.location.coords.latitude,
                longitude: userOrder.orderAddress.location.coords.longitude,
              }}
              title="Delivery Address"
            >
              <FontAwesome name="flag" size={30} color="orange" />
            </Marker>
          )}

          {userLocation && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor="orange"
            />
          )}
        </MapView>
      )}

      {userOrder ? (
        <>
          <View style={styles.orderCard}>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/thumbnails/033/494/670/large/animated-illustration-of-foods-menu-burger-french-fries-and-soft-drink-suitable-for-foods-promotion-free-video.jpg",
              }}
              style={styles.image}
            />
            <View style={styles.orderDetails}>
              <Text style={styles.orderTime}>
                Ordered At{" "}
                {userOrder?.timestamp
                  ? new Date(userOrder.timestamp).toLocaleString()
                  : "Unknown"}
              </Text>
              {userOrder?.items.map((item, index) => (
                <Text key={index} style={styles.orderItems}>
                  {item.quantity}x {item.name}
                </Text>
              ))}
              <Text style={styles.deliveryAddress}>
                <Text style={{ fontWeight: "bold" }}>Delivery Address: </Text>
                {userOrder?.orderAddress?.street
                  ? `${userOrder.orderAddress.street}, ${userOrder.orderAddress.city}`
                  : userOrder?.orderAddress?.city ?? "Unknown"}
              </Text>
            </View>
          </View>

          <View style={styles.deliveryGuyCard}>
            <Image
              source={{ uri: deliveryGuy.photo }}
              style={styles.deliveryGuyImage}
            />
            <View style={styles.deliveryGuyInfo}>
              <Text style={styles.deliveryGuyName}>{deliveryGuy.name}</Text>
              <Text style={styles.deliveryGuyVehicle}>
                On a {deliveryGuy.vehicle}
              </Text>
              <Text style={styles.deliveryGuyPhone} onPress={callDeliveryGuy}>
                {deliveryGuy.phoneNumber}
              </Text>
            </View>
          </View>

          {/* Received Order Section */}
          <View style={styles.receivedOrderContainer}>
            <Text style={styles.receivedOrderText}>
              Have you received your order?
            </Text>
            <TouchableOpacity
              style={styles.receivedOrderButton}
              onPress={handleOrderReceived}
            >
              <Text style={styles.receivedOrderButtonText}>
                Yes, I Received It
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noOrderContainer}>
          <Text style={styles.noOrderText}>
            No active orders at the moment.
          </Text>
        </View>
      )}
    </View>
  );
};

export default TrackingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  map: { flex: 1 },
  orderCard: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  image: { width: 60, height: 60, borderRadius: 10, marginRight: 15 },
  orderDetails: { flex: 1 },
  orderTime: { fontSize: 14, color: "gray", marginBottom: 5 },
  orderItems: { fontSize: 14, fontWeight: "500", color: "#333" },
  deliveryAddress: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginTop: 10,
  },

  receivedOrderContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
  },
  receivedOrderText: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  receivedOrderButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
  },
  receivedOrderButtonText: { color: "#fff", fontWeight: "bold" },
  noOrderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noOrderText: { fontSize: 16, fontWeight: "bold", color: "gray" },
  deliveryGuyCard: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deliveryGuyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  deliveryGuyInfo: {
    flex: 1,
    justifyContent: "center",
  },
  deliveryGuyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deliveryGuyVehicle: {
    fontSize: 14,
    color: "gray",
  },
  deliveryGuyPhone: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 5,
  },
});
