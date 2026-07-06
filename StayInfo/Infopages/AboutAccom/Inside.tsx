import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const insideEntertainmentData: InfoSection[] = [
  {
    header: "Television",
    text: "You’re welcome to use our TV and entertainment system for your personal use. You’ll find the remote control on the coffee table. If you log into any streaming services, please log out before you head off.",
  },
  {
    header: "Music System",
    text: "You’re more than welcome to use our sound system. You can connect any device via Bluetooth or with a cable. We ask you to be mindful about volumes, especially early in the morning and late at night.",
  },
  {
    header: "Entertainment Options",
    text: "Enjoy a selection of books and reading material, as well as board games for family fun. The property also features life-size games for an engaging experience.",
  },
];

export default function Inside({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Enjoying Your Time Inside"
      sections={insideEntertainmentData}
    />
  );
}