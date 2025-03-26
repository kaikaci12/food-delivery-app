import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TrackingScreen = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [deliveryGuyLocation, setDeliveryGuyLocation] = useState({
    latitude: 41.7151,
    longitude: 44.8271,
  });

  const [userOrder, setUserOrder] = useState<any>(order); // Assuming you have the order data
  const [isLoading, setIsLoading] = useState<boolean>(loading); // Assuming loading state

  const orderAddress = userOrder?.orderAddress?.location;

  // Simulate movement of delivery guy towards order address
  const moveDeliveryGuy = () => {
    const interval = setInterval(() => {
      if (orderAddress) {
        const distance = haversineDistance(
          deliveryGuyLocation.latitude,
          deliveryGuyLocation.longitude,
          orderAddress.latitude,
          orderAddress.longitude
        );

        // Stop the movement if the delivery guy reaches the destination
        if (distance < 0.01) {
          // Threshold for reaching destination (10 meters)
          clearInterval(interval);
          return;
        }

        // Move 1% of the distance towards the destination
        const latStep =
          (orderAddress.latitude - deliveryGuyLocation.latitude) * 0.01;
        const lonStep =
          (orderAddress.longitude - deliveryGuyLocation.longitude) * 0.01;

        setDeliveryGuyLocation((prevLocation) => ({
          latitude: prevLocation.latitude + latStep,
          longitude: prevLocation.longitude + lonStep,
        }));
      }
    }, 3000); // Update every 3 seconds
  };

  useEffect(() => {
    if (orderAddress) {
      moveDeliveryGuy();
    }
  }, [orderAddress]);

  // Calculate the distance between two points (Haversine formula)
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // returns distance in km
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

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
          showsUserLocation
        >
          {/* Delivery Guy Marker */}
          <Marker coordinate={deliveryGuyLocation} title="Delivery Guy">
            <View style={styles.deliveryMarker}>
              <Image
                source={{ uri: "delivery-guy-photo-url" }} // Replace with actual URL
                style={styles.deliveryGuyPhoto}
              />
              <Ionicons
                name="bicycle"
                size={30}
                color="red"
                style={styles.deliveryIcon}
              />
              <Text>{userOrder?.deliveryTime}</Text>
            </View>
          </Marker>

          {/* User Location Marker */}
          <Marker coordinate={userLocation} title="Your Location">
            <Ionicons name="person" size={30} color="blue" />
          </Marker>

          {/* Order Address Marker */}
          {orderAddress && (
            <Marker coordinate={orderAddress} title="Delivery Address">
              <FontAwesome name="flag" size={30} color="yellow" />
            </Marker>
          )}

          {/* Route Polyline */}
          <Polyline
            coordinates={[deliveryGuyLocation, userLocation, orderAddress]}
            strokeWidth={5}
            strokeColor="orange"
          />
        </MapView>
      )}

      {/* Order Info */}
      <View style={styles.orderCard}>
        <Image
          source={{ uri: "order-image-url" }} // Replace with actual URL
          style={styles.image}
        />
        <View style={styles.orderDetails}>
          <Text style={styles.orderTime}>
            Ordered At{" "}
            {userOrder?.timestamp
              ? new Date(userOrder.timestamp).toLocaleString()
              : "Unknown"}
          </Text>
          {Array.isArray(userOrder?.items) &&
            userOrder.items.map((item: any, index: number) => (
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

      {/* Delivery Guy Info */}
      <View style={styles.deliveryGuyCard}>
        <Image
          source={{ uri: "delivery-guy-photo-url" }} // Replace with actual URL
          style={styles.deliveryGuyImage}
        />
        <View style={styles.deliveryGuyInfo}>
          <Text style={styles.deliveryGuyName}>
            {userOrder?.deliveryGuy?.name}
          </Text>
          <Text style={styles.deliveryGuyVehicle}>
            On a {userOrder?.deliveryGuy?.vehicle}
          </Text>
          <Text style={styles.deliveryGuyPhone}>
            {userOrder?.deliveryGuy?.phoneNumber}
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  map: { flex: 1 },
  orderCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
  deliveryMarker: { alignItems: "center" },
  deliveryGuyPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  deliveryIcon: { marginTop: 5 },
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  deliveryGuyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  deliveryGuyInfo: { flex: 1 },
  deliveryGuyName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  deliveryGuyVehicle: { fontSize: 14, color: "gray", marginBottom: 5 },
  deliveryGuyPhone: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default TrackingScreen;
