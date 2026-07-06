import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage , {InfoSection} from "../components/InfoAccordionPage";
import {View, Text } from "react-native";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const arrivalData: InfoSection[] = [
    {
        header:'Access Codes / Instructions',
        text:  "Welcome to THE KEEP! Your self check-in is facilitated through a lockbox. The lockbox is located at the main entrance of the property at 535 New England Road, Goulds Country, Tasmania, Australia. You will receive the access code via email prior to your arrival. Please ensure you have the code before you travel. If you have not received it, contact us immediately at admin@thekeeptasmania.com.au.",
    },
    {
        header:'Check-in Time',
        text: "Your check-in time is 14:00. If you plan to arrive earlier, please contact us, and we will do our best to accommodate your request. For early arrivals, explore the local area with our guide for things to do while you wait."   
    },
    {
        header:"Parking Information",
        text:"Free parking is available on the premises as well as on the street. When you arrive, you can park your vehicle in the designated parking area near the entrance."
    },
    {
        header: "Late Arrivals",
        text: "If you expect to arrive late, please inform us in advance. The lockbox allows for flexible check-in times, but notifying us helps ensure a smooth arrival experience."
    }
    ];

export default function ArrivalInfo({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Planning Your Arrival"
      sections={arrivalData}
    />
  );
}