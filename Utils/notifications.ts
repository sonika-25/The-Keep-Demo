import { Platform, PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging";

export async function requestNotificationPermission() {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const authStatus = await messaging().requestPermission();

  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function getFcmToken() {
  const token = await messaging().getToken();
  console.log("FCM Token:", token);
  return token;
}

export function listenForForegroundMessages() {
  return messaging().onMessage(async remoteMessage => {
    console.log("Foreground notification:", remoteMessage);
  });
}