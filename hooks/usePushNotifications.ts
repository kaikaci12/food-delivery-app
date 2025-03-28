//later    // import Notification from "expo-notifications";
// import * as Device from "expo-device";
// import Constants from "expo-constants";
// import { Platform } from "react-native";
// import { useState, useEffect, useRef } from "react";

// export interface PushNotificationState {
//   notification?: Notification.Notification;
//   expoPushToken: Notification.ExpoPushToken;
// }

// export const usePushNotifications = () => {
//   const [expoPushToken, setExpoPushToken] = useState<
//     Notification.ExpoPushToken | undefined
//   >();
//   const [notification, setNotification] = useState<
//     Notification.Notification | undefined
//   >();
//   const notificationListener = useRef<Notification.EventSubscription>();
//   const responseListener = useRef<Notification.EventSubscription>();

//   // Handle incoming notifications
//   useEffect(() => {
//     Notification.setNotificationHandler({
//       handleNotification: async () => {
//         return {
//           shouldShowAlert: true,
//           shouldPlaySound: false, // or true if you want sound
//           shouldSetBadge: false,
//         };
//       },
//     });
//   });
//   const registerForPushNotificationsAsync = async () => {
//     let token;
//     if (Device.isDevice) {
//       const { status: existingStatus } =
//         await Notification.getPermissionsAsync();
//       let finalStats = existingStatus;
//       if (existingStatus !== "granted") {
//         const { status } = await Notification.requestPermissionsAsync();
//         finalStats = status;
//       }
//       if (finalStats !== "granted") {
//         console.error("failed to get a push token");
//       }
//       token = await Notification.getExpoPushTokenAsync({
//         projectId: Constants.easConfig?.extra?.eas?.projectId,
//       });
//       if (Platform.OS === "android") {
//         Notification.setNotificationChannelAsync("default", {
//           name: "default",
//           importance: Notification.AndroidImportance.MAX,
//           vibrationPattern: [5000],
//           lightColor: "red",
//         });
//         return token;
//       } else {
//         console.log("please use a physical device");
//       }
//     }
//   };
//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) => {
//       setExpoPushToken(token);
//     });
//   }, []);

//   return { expoPushToken, notification };
// };
