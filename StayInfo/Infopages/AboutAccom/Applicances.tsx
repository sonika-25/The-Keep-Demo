import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from  "../../components/InfoAccordionPage";
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const appliancesData: InfoSection[] = [
  {
    header: "Kitchen Equipment",
    text: "All devices should be fairly straightforward to use. Here are some specifics you might want to know:\n\nThe dishwasher is located in the kitchen, and the gas stove and double oven are perfect for preparing meals. Enjoy a variety of coffee options with our drip coffee maker, French press, Nespresso, and pour-over coffee makers.",
  },
  {
    header: "Heating & Cooling",
    text: "The thermostat is located in the living area. The property features central heating and radiant heating, along with portable fans for cooling. An indoor gas fireplace adds a cozy touch to your stay.",
  },
  {
    header: "Laundry Appliances",
    text: "The washing machine and dryer are available for your use. Essentials such as towels, bed sheets, soap, and toilet paper are provided. An iron is also available for your convenience.",
  },
];

export default function Appliances({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Appliances"
      sections={appliancesData}
    />
  );
}