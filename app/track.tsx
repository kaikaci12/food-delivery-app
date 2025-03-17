import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocation } from "@/hooks/useLocation";
import { useOrder } from "@/hooks/useOrder";

const TrackingScreen = () => {
  // Get user location and order data from custom hooks
  const { location } = useLocation();
  const { order } = useOrder();

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userOrder, setUserOrder] = useState(order);

  // Delivery guy's location (Start Point)
  const deliveryLocation = {
    latitude: 41.6938,
    longitude: 44.8015,
  };

  // Random delivery guy info
  const deliveryGuy = {
    name: "John Doe",
    photo:
      "https://www.vie-aesthetics.com/wp-content/uploads/2021/09/shutterstock_1877631178-600x600.jpg",
    vehicle: "bicycle",
  };

  // Update location & order when they change
  useEffect(() => {
    if (location?.coords) {
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
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
          region={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Delivery Guy Marker */}
          <Marker coordinate={deliveryLocation} title="Delivery Guy">
            <View style={styles.deliveryMarker}>
              <Image
                source={{ uri: deliveryGuy.photo }}
                style={styles.deliveryGuyPhoto}
              />
              <Ionicons
                name={deliveryGuy.vehicle}
                size={30}
                color="red"
                style={styles.deliveryIcon}
              />
            </View>
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
          source={{
            uri: "https://static.vecteezy.com/system/resources/thumbnails/033/494/670/large/animated-illustration-of-foods-menu-burger-french-fries-and-soft-drink-suitable-for-foods-promotion-free-video.jpg",
          }}
          style={styles.image}
        />
        <View style={styles.orderDetails}>
          <Text style={styles.orderTime}>
            Ordered At{" "}
            {new Date(userOrder?.timestamp ?? "").toISOString() ||
              "06 Sept, 10:00pm"}
          </Text>
          {userOrder?.items?.map((item, index) => (
            <Text key={index} style={styles.orderItems}>
              {item.quantity}x {item.name}
            </Text>
          ))}
        </View>
      </View>

      {/* Delivery Guy Info Card */}
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
    bottom: 100,
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
  orderDetails: {
    flex: 1,
  },
  orderTime: {
    fontSize: 14,
    color: "gray",
  },
  orderItems: {
    fontSize: 14,
    fontWeight: "500",
  },
  deliveryMarker: {
    alignItems: "center",
  },
  deliveryGuyPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  deliveryIcon: {
    marginTop: 5,
  },
  deliveryGuyCard: {
    position: "absolute",
    top: 20,
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
  deliveryGuyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  deliveryGuyInfo: {
    flex: 1,
  },
  deliveryGuyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deliveryGuyVehicle: {
    fontSize: 14,
    color: "gray",
  },
});
