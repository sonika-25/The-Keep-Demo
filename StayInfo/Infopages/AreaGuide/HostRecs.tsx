import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const hostRecs: InfoSection[] = [
  {
    header: "Sue's Favorite spots",
    text: "Sue Stagg, your host, recommends visiting the Pyengana Dairy Company for its exquisite cheese and the St Columba Falls for a refreshing nature experience. For any inquiries or further recommendations, feel free to reach out at admin@thekeeptasmania.com.au.",
  },
  
];

export default function HostRecs({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Host Reccomendations"
      sections={hostRecs}
    />
  );
}