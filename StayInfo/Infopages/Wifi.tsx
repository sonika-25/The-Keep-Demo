import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const WifiData: InfoSection[] = [
  {
    header: "WiFi / Internet Details",
    image:require('../../assets/wifi.jpg'),
    text: `There is free Wi-Fi in the property. The details are:

            ID: [Your WiFi Network Name]

            Password: [Your WiFi Password]

We provide this service for your enjoyment and convenience. However, please note that you are responsible for its safe and appropriate use and compliance with all laws. If there is any loss of service, please contact us.

For any connectivity issues, try restarting the router by unplugging it, waiting 30 seconds, and plugging it back in. If problems persist, please reach out to us at admin@thekeeptasmania.com.au.

Entertainment options include a sound system with Bluetooth and aux capabilities, allowing you to stream your favorite music.`,
  },
];

export default function WifiSection({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Wifi / Internet Details"
      sections={WifiData}
    />
  );
}