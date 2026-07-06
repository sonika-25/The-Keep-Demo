import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const localFoodData: InfoSection[] = [
  {
    header: "The Pub in the Paddock",
    text: "Located just a short 15-minute drive from THE KEEP, The Pub in the Paddock offers a cozy atmosphere with a selection of local beers and hearty meals. It's a great spot to unwind and enjoy the local hospitality.",
  },
  {
    header: "Pyengana Dairy Company",
    text: "Famous for its award-winning cheeses, the Pyengana Dairy Company is a must-visit for cheese lovers. It's about a 20-minute drive from THE KEEP and offers tastings and a delightful café menu featuring fresh, local produce.",
  },
];

export default function Dining({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Dining"
      sections={localFoodData}
    />
  );
}