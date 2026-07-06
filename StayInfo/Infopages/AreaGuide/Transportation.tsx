import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const TransportData: InfoSection[] = [
  {
    header: "Local Transportation",
    text: `While public transportation options are limited in Goulds Country, car rentals are available in nearby towns. Driving is the most convenient way to explore the beautiful surroundings of THE KEEP.`,
  },
];

export default function Transportation({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Transportation"
      sections={TransportData}
    />
  );
}