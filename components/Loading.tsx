import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";

const LoadingAnimation = () => {
  const rotation = useSharedValue(0);

  rotation.value = withRepeat(
    withTiming(360, {
      duration: 1000,
      easing: Easing.linear,
    }),
    -1, // Infinite loop
    false
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, animatedStyles]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: "red",
    borderTopColor: "transparent",
  },
});

export default LoadingAnimation;
