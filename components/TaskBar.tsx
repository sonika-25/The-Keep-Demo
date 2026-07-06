import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function Taskbar({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Info")}
      >
        <Text style={styles.buttonText}> ← Information</Text>
      </TouchableOpacity>
        <TouchableOpacity style= {styles.button}>
            <Text></Text>
        </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Navigation→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "101%",
    backgroundColor: "#236426",
    borderTopWidth: 1,
    borderTopColor: "rgb(255, 255, 255)",
  },

  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: 'CormorantGaramond-SemiBold',
  },
});