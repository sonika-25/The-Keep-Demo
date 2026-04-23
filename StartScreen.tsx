// src/StartScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function StartScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Replace with your actual logo path */}
      <Text style ={styles.welcome}>Welcome to the Keep App</Text>
      <Image
        source={require("./assets/logo.webp")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}

      >
        <Text style={styles.buttonText}>Continue to Navigation</Text>
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
    fontSize:25,
    color: "#9bd4a9",
    marginBottom: 20
  },
  logo: {
    width: 220,
    height: 120,
    marginBottom: 40,
  },
  button: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#2e7d32",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: "#2e7d32",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});