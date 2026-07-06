// src/Instructions.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function Instructions({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Replace with your actual logo path */}
      <Text style ={styles.welcome}>Welcome to the Keep App</Text>
      <Image
        source={require("./assets/logo.webp")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text> 
        To use this app make sure you have internet connection when you load the Instructions
        <br />
        Step 1: Choose your origin (eg: Launceston or Hobart Airport) and your destination (eg: The Keep)
        <br />
        Step 2: Add any stops you want, even before you reach the Keep, the tasmanian wilderness has much to offer, check the dropdown or this link to see your options
        <br />
        Step 3: Click on Go To Map to load the route required, and start your journey!

      </Text>
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});