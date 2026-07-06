import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, {InfoSection} from "../../components/InfoAccordionPage";
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const amenitiesData: InfoSection[] = [
  {
    header: "Overview",
    text: "Welcome to THE KEEP, a unique retreat located in the serene region of Goulds Country, Tasmania. This accommodation offers a private entrance and a spacious layout designed for comfort and relaxation. Enjoy the stunning views from the patio or balcony, and unwind in the private hot tub available year-round.",
  },
  {
    header: "Rooms and Features",
    text: "The property includes a well-equipped kitchen with a gas stove, double oven, and a variety of coffee makers including a drip coffee maker, French press, Nespresso, and pour-over coffee. The bedroom features cotton linens and extra pillows and blankets for your comfort. The bathroom is stocked with essentials such as shampoo, conditioner, and body soap.",
  },
  {
    header: "Unique Aspects",
    text: "THE KEEP offers a range of unique amenities including a record player, life-size games, and a sound system with Bluetooth and aux connectivity. For outdoor enthusiasts, there's a private backyard with a fire pit, hammock, and sun loungers.",
  },
];

export default function Amenities({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Property Layout and Amenities"
      sections={amenitiesData}
    />
  );
}