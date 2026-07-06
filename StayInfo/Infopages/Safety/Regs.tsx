import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const RegsData: InfoSection[] = [
  {
    header: "Quiet Times",
        image:require('../../../assets/quiet.jpg'),

    text: "We are located in a friendly and welcoming community and, although this is a holiday destination, it's home to other people. As such we ask that you respect their privacy and their right to a peaceful existence! Specifically, between the hours of 10 PM and 8 AM noise should be kept to a minimum.",
  },
  {
    header: "Breakages",
    text: "We understand that sometimes accidents happen! Should you break anything, please let us know immediately - if it's minor we usually won't charge. If it's a larger issue, such as the TV screen, we would like to agree the cost with you before you leave to avoid any issues later. Thank you!",
  },
  {
    header: "Smoking Policy",
    text: "This is a smoke-free home, including the outside area surrounding the property. No smoking of any substance, including vaping.",
  },
  {
    header: "Pets",
    text: "We love animals but we chose to make this home pet-free due to many people being allergic, please respect that.",
  },
  {
    header: "Parties",
    text: "Parties and events are not allowed at THE KEEP. We appreciate your understanding and cooperation in maintaining a peaceful environment for all guests.",
  },
];

export default function Regs({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Rules and Regulations"
      sections={RegsData}
    />
  );
}