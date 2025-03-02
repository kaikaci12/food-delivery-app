import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import OnboardingScreen from "react-native-onboarding-swiper";

const OnBoarding = () => {
  return (
    <View style={styles.container}>
      <OnboardingScreen
        pages={[
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("../assets/images/onboarding1.png")}
                style={styles.image}
              />
            ),
            title: "All your favorites",
            subtitle:
              "Get all your loved foods in one place, you just place the order, we do the rest.",
          },
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("../assets/images/onboarding2.png")}
                style={styles.image}
              />
            ),
            title: "Order from chosen chef",
            subtitle:
              "Get all your loved foods in one place, you just place the order, we do the rest.",
          },
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("../assets/images/onboarding3.png")}
                style={styles.image}
              />
            ),
            title: "Free delivery offers",
            subtitle:
              "Get all your loved foods in one place, you just place the order, we do the rest.",
          },
        ]}
        nextLabel="NEXT"
        skipLabel="Skip"
        showSkip
      />
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
});
