import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useLocation } from "@/hooks/useLocation";
import { useOrder } from "@/hooks/useOrder";

const TrackingScreen = () => {
  // Get user location and order data from custom hooks
  const { location } = useLocation();
  const { order } = useOrder();

  const [userLocation, setUserLocation] = useState(location);
  const [userOrder, setUserOrder] = useState(order);

  // Delivery guy's location (Start Point)
  const deliveryLocation = {
    latitude: 37.7849,
    longitude: -122.4094,
  };

  // Update location & order when they change
  useEffect(() => {
    if (location) setUserLocation(location);
    if (order) setUserOrder(order);
  }, [location, order]);

  // Route Coordinates (Ensuring `userLocation` is valid)
  const routeCoordinates = userLocation
    ? [
        deliveryLocation,
        { latitude: 37.78, longitude: -122.412 },
        { latitude: 37.778, longitude: -122.415 },
        userLocation, // Final destination
      ]
    : [];

  return (
    <View style={styles.container}>
      {/* Render only if userLocation is available */}
      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Delivery Guy Marker */}
          <Marker coordinate={deliveryLocation} title="Delivery Guy">
            <Ionicons name="bicycle" size={30} color="red" />
          </Marker>

          {/* User Location Marker */}
          <Marker coordinate={userLocation} title="Your Location">
            <Ionicons name="location" size={30} color="blue" />
          </Marker>

          {/* Route Path (Orange line) */}
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="orange"
          />
        </MapView>
      )}

      {/* Bottom Order Details Card */}
      <View style={styles.orderCard}>
        <Image
          source={{ uri: "https://source.unsplash.com/100x100/?food" }}
          style={styles.image}
        />
        <View>
          <Text style={styles.orderTime}>
            Ordered At {userOrder?.timestamp || "06 Sept, 10:00pm"}
          </Text>
          {userOrder?.items?.map((item, index) => (
            <Text key={index} style={styles.orderItems}>
              {item.quantity}x {item.name}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default TrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
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
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderTime: {
    fontSize: 14,
    color: "gray",
  },
  orderItems: {
    fontSize: 14,
    fontWeight: "500",
  },
});
