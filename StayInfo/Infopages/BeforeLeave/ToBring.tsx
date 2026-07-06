import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, {InfoSection} from "../../components/InfoAccordionPage";
import {View, Text } from "react-native";
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const toBringData: InfoSection[] = [
  {
    header:'Things to Bring',
    text: `Whilst we provide a lot of things, you may want to consider bringing the following which we don't provide!

       • Personal toiletries
       • Camera, memory cards, chargers
       • Personal electronics chargers, 
         adaptors as needed
       • Flashlights, batteries
       • Swimwear for the hot tub
       • Warm clothing for cooler eveni
    `,
  },

];

export default function ToBring({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Don't Forget to Bring"
      sections={toBringData}
    />
  );
}