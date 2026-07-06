import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, {InfoSection} from "../../components/InfoAccordionPage";
import {View, Text } from "react-native";
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const ShopOptionsData: InfoSection[] = [
  {
    header:'Local Shop Options',
    title: "Nearby Grocery Stores",
    text: "For your convenience, there are several local shops where you can pick up necessities. The closest grocery store is located in St Helens, about a 20-minute drive from THE KEEP. They offer a wide range of products, including fresh produce, meats, and household items.",
  },

];

export default function ShopOptions({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Local Shop Options"
      sections={ShopOptionsData}
    />
  );
}