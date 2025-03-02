import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const OnboardingScreen = () => {
  const steps = {};
  return (
    <View style={styles.container}>
      <OnboardingScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 250,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "lightgray",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#FF7F3F",
  },
  nextButton: {
    backgroundColor: "#FF7F3F",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 20,
  },
  nextText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  skipText: {
    color: "gray",
    fontSize: 14,
    marginTop: 10,
  },
});

export default OnboardingScreen;
