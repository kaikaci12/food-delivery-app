import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import OnboardingScreen from "react-native-onboarding-swiper";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
const OnBoarding = () => {
  const { authState } = useAuth();
  const router = useRouter();
  // useEffect(() => {
  //   if (authState.user && authState.token) {
  //     router.navigate("/Dashboard");
  //   }
  // }, [router]);
  const handleDone = () => {
    router.replace("/register");
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  const NextButton = ({ ...props }) => (
    <TouchableOpacity style={styles.button} {...props}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  );

  const SkipButton = ({ ...props }) => (
    <TouchableOpacity style={[styles.button, styles.skipButton]} {...props}>
      <Text style={[styles.buttonText, { color: "#777" }]}>Skip</Text>
    </TouchableOpacity>
  );

  const DoneButton = ({ ...props }) => (
    <TouchableOpacity style={[styles.button, styles.doneButton]} {...props}>
      <Text style={[styles.buttonText, { color: "#fff" }]}>Get Started</Text>
    </TouchableOpacity>
  );
  const DotComponent = ({ selected }: any) => {
    return <View style={[styles.dot, selected ? styles.activeDot : null]} />;
  };
  return (
    <View style={styles.container}>
      <OnboardingScreen
        containerStyles={styles.onboarding}
        bottomBarColor="white"
        NextButtonComponent={NextButton}
        SkipButtonComponent={SkipButton}
        DoneButtonComponent={DoneButton}
        onDone={handleDone}
        onSkip={handleSkip}
        DotComponent={DotComponent}
        pages={[
          {
            backgroundColor: "#f8f9fa",
            image: (
              <Image
                source={require("../assets/images/onboarding1.png")}
                style={styles.image}
              />
            ),
            title: "All Your Favorites",
            subtitle:
              "Get all your favorite foods in one place. Just place the order, and we do the rest.",
          },
          {
            backgroundColor: "#f8f9fa",
            image: (
              <Image
                source={require("../assets/images/onboarding2.png")}
                style={styles.image}
              />
            ),
            title: "Order from Top Chefs",
            subtitle:
              "Choose from the best chefs around and enjoy delicious meals anytime.",
          },
          {
            backgroundColor: "#f8f9fa",
            image: (
              <Image
                source={require("../assets/images/onboarding3.png")}
                style={styles.image}
              />
            ),
            title: "Exclusive Free Delivery",
            subtitle:
              "Enjoy free delivery on your first order. Tasty food at your doorstep, hassle-free!",
          },
        ]}
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
    width: 280,
    height: 280,
    resizeMode: "contain",
  },
  onboarding: {},
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: "#FF6B6B",
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  skipButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#777",
  },
  doneButton: {
    backgroundColor: "#28C76F",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#FFE1CE",
    marginRight: 10,
  },
  activeDot: {
    backgroundColor: "#FF6B6B", // Darker color when active
  },
});
