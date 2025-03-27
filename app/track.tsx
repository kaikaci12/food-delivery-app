import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, Linking } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocation } from "@/context/LocationProvider";
import { useOrder } from "@/hooks/useOrder";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Order } from "@/hooks/useOrder";
import * as Updates from "expo-updates";
const TrackingScreen = () => {
  const {
    location,
    tracking,
    requestLocation,
    errorMsg,
    startTracking,
    checkLocationServices,
    locationEnabled,
  } = useLocation();
  console.log(location);
  const { order, loading } = useOrder();

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
    location: {
      latitude: 41.7151,

      longitude: 44.8271,
    },
  };
  useEffect(() => {
    checkLocationServices();

    if (locationEnabled === false) {
      Alert.alert("Location Disabled", "Please enable location services", [
        { text: "OK" },
      ]);
    }
  }, [locationEnabled]);

  useEffect(() => {
    if (location?.coords) {
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location, locationEnabled]);
  useEffect(() => {
    if (order) {
      setUserOrder(order);
    }

    console.log("order coords from tracking", order?.orderAddress?.location);
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
            <View style={styles.deliveryMarker}>
              <Ionicons
                name={deliveryGuy.vehicle === "bicycle" ? "bicycle" : "car"}
                size={10}
                color="red"
                style={styles.deliveryIcon}
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
          {userOrder?.items.map((item: any, index: number) => (
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
    </View>
  );
};

export default TrackingScreen;

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
});
