import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Navbar from "../../components/Navbar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Taskbar from "../../components/TaskBar";
export type InfoSection = {
  title?: string;
  header: string;
  text: string;
  image?: any;
  innerData?: string[];
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  title: string;
  sections: InfoSection[];
};

export default function InfoAccordionPage({
  navigation,
  title,
  sections,
}: Props) {
    const [openItems, setOpenItems] = useState<number[]>(
    sections.map((_, index) => index)
    );
  return (
    <View style={styles.screen}>
      <Navbar
        title={title}
        leftText="Back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        {sections.map((item, index) => {
          const isOpen = openItems.includes(index);

          return (
            <TouchableOpacity
              key={index}
              style={styles.box}
              activeOpacity={0.8}
              onPress={() => {
                if (isOpen) {
                  setOpenItems(openItems.filter((i) => i !== index));
                } else {
                  setOpenItems([...openItems, index]);
                }
              }}
            >
              <View style={styles.headerRow}>
                <Text style={styles.heading}>{item.header}</Text>
                <Text style={styles.arrow}>{isOpen ? "▲" : "▼"}</Text>
              </View>
              {isOpen && <View style={styles.divider} />}

              {isOpen && item.image && (
                <Image source={item.image} style={styles.image} />
              )}

              {isOpen && (
                <>
                  {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
                  <Text style={styles.text}>{item.text}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    <Taskbar navigation={navigation} />

    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    
  },
divider: {
  marginTop:5,
  height: 2,
  backgroundColor: "#236426b8",
  marginBottom:20,
},
  container: {
    padding: 20,
    gap: 16,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  arrow: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#18451b",
  },

  box: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#236426",
    
  },

  text: {
    fontSize: 17,
    fontWeight: "300",
    color: "#000",
    fontFamily: 'CormorantGaramond-Medium',

  },

  heading: {
    fontWeight: "400",
    fontSize: 18,
    color: "#000",
    fontFamily: 'CormorantGaramond-Bold',

  },

  image: {
    height: 200,
    width: "100%",
  },

  title: {
    fontWeight: "400",
    marginBottom: 8,
    fontSize: 17,
    color: "#000",
    fontFamily: 'CormorantGaramond-SemiBold',

  },
});