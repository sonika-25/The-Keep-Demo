import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const shoppingData: InfoSection[] = [
  {
    header: "St Helens Market",
    text: "Held every Saturday, the St Helens Market is a vibrant spot to pick up local crafts, fresh produce, and unique souvenirs. It's a 45-minute drive from THE KEEP, perfect for a leisurely morning outing.",
  },
  
];

export default function Shopping({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Shopping"
      sections={shoppingData}
    />
  );
}