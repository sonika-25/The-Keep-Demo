import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const outsideData: InfoSection[] = [
  {
    header: "Grill / BBQ",
    text: "There is an outdoor electric grill available for your use. Please make sure you leave the grill clean to avoid any additional cleaning fees.",
  },
  {
    header: "Chairs / Tables",
    text: "There is a dining table and chairs outside as well as non-breakable tableware for al fresco feasts. Sun loungers and an outdoor sofa with cushions are also available for your use - please put the cushions away on bad weather days and before you leave.",
  },
];

export default function Outside({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Enjoying Your Time Outside"
      sections={outsideData}
    />
  );
}