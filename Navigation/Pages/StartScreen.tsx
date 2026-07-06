// src/StartScreen.tsx
import React , {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  requestNotificationPermission,
  getFcmToken,
  listenForForegroundMessages,
} from "../../Utils/notifications";
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function StartScreen({ navigation }: Props) {
  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestNotificationPermission();

      if (hasPermission) {
        await getFcmToken();
      }
    };

    setupNotifications();

    const unsubscribe = listenForForegroundMessages();

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      {/* Replace with your actual logo path */}
      <Text style ={styles.welcome}>Welcome to the Keep App</Text>
      <Image
        source={require("../../assets/logo.webp")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Info")}

      >
        <Text style={styles.buttonText}>Stay Info</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}

      >
        <Text style={styles.buttonText}>Navigation</Text>
      </TouchableOpacity>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  welcome : {
    fontFamily: 'Cinzel-Medium',
    fontSize:40,
    letterSpacing:2,
    color: "#ffffff",
    marginBottom: 20,
    textAlign:'center',
    alignContent: 'center'
  },
  logo: {
    width: 220,
    height: 120,
    marginBottom: 40,
  },
  button: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#236426",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: "#236426",
  },
  buttonText: {
    fontFamily: 'Cinzel-SemiBold',
    color: "#fff",
    fontSize: 23,
    fontWeight: "600",
  },
});