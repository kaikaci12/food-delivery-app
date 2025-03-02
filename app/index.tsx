import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <OnboardingScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
});

export default OnboardingScreen;
