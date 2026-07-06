import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const safetyData: InfoSection[] = [
  {
    header: "What to do in an Emergency",
    image:require('../../../assets/safety.jpg'),
    text: "For emergency services, including ambulance, police, and fire, call 000.\n\nDo not delay if you feel an emergency situation has arisen. State your location as 535 New England Road, Goulds Country, Tasmania, Australia.",
  },
  {
    header: "In Case of a Fire",
    text: "• Exit the property as quickly as possible\n• Ensure that all persons are accounted for\n• Do not attempt to re-enter the building until a Fire Officer states that it is safe to do so.",
  },
  {
    header: "Emergency Phone Numbers",
    text: "For emergency services, immediately call 000. Do not delay if you feel an emergency situation has arisen.",
  },
  {
    header: "Property Safety Features",
    text: "THE KEEP is equipped with essential safety features to ensure your security during your stay:\n\n• Smoke alarm\n• Fire extinguisher located in the kitchen area\n• First aid kit available in the bathroom\n• Exterior security cameras on the driveway near the water tanks and sheds, and one in the gas tank area behind the shed",
  },
  {
    header: "Liability Disclaimer",
    text: "Guests are responsible for their own safety and the safety of their belongings during their stay. The management of THE KEEP is not liable for any accidents, injuries, or loss of personal items. Please ensure that you lock the doors and windows when leaving the property.",
  },
];

export default function Safetyinfo({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Safety Information"
      sections={safetyData}
    />
  );
}