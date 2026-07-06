import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const rulesData: InfoSection[] = [
  {
    header: "House Rules",
    text: "Please note that pets, parties, and smoking are not allowed on the premises. We appreciate your cooperation in maintaining a peaceful environment for all guests.",
  },
];

export default function Rules({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Property Rules"
      sections={rulesData}
    />
  );
}