// src/components/Navbar.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type NavbarProps = {
  title: string;
  leftText?: string;
  rightText?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export default function Navbar({
  title,
  leftText,
  rightText,
  onLeftPress,
  onRightPress,
}: NavbarProps) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onLeftPress} style={styles.side}>
      <Text style={styles.navText}>{leftText ? `‹ ${leftText}` : ""}</Text>
      </TouchableOpacity>

      <Text style={styles.titleText}>{title}</Text>

      <TouchableOpacity onPress={onRightPress} style={styles.side}>
        <Text style={styles.navText}>{rightText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    backgroundColor: "#236426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 32,
    paddingBottom: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
    fontFamily: 'CormorantGaramond-Bold',

  },

  side: {
    width: 76,
    minHeight: 36,
    justifyContent: "center",
  },

  titleText: {
    flex: 1,
    color: "white",
    fontSize: 20,
    letterSpacing: 1,
    textAlign: "center",
    fontFamily: 'CormorantGaramond-Bold',


  },

  navText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: 'CormorantGaramond-SemiBold',

  },
});