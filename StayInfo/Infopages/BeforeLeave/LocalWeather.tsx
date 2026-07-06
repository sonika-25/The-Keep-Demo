import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, {InfoSection} from "../../components/InfoAccordionPage";
import {View, Text } from "react-native";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const weatherData: InfoSection[] = [
  {
    header:'Local Weather',
    title:"Check the Weather",
    image:require('../../../assets/weatherImage.jpg'),
    text:  "Goulds Country, Tasmania, enjoys a temperate climate. Summers are mild, while winters can be cool and rainy. We recommend checking the weather forecast before your trip to pack accordingly. Remember to bring layers and a raincoat, especially if visiting during the cooler months.",
  },

];

export default function LocalWeather({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Local Weather"
      sections={weatherData}
    />
  );
}