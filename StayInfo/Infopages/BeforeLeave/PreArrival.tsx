import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, {InfoSection} from "../../components/InfoAccordionPage";
import {View, Text } from "react-native";
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const preArrivalData: InfoSection[] = [
  {
    header:'Pre-Arrival Communication',
    title:"Contact Your Host",
    text: "Before your arrival, please ensure you have the self check-in instructions handy. If you have any questions or need assistance, feel free to reach out to your host, Sue Stagg, at admin@thekeeptasmania.com.au or call +61 0408484132.",
  },

];

export default function PreArrival({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Pre-Arrival Communication"
      sections={preArrivalData}
    />
  );
}