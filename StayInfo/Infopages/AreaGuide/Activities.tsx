import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const ActivitiesData: InfoSection[] = [
  {
    header: "Life-Size Games at THE KEEP",
    text: `Enjoy a fun-filled day with life-size games available at THE KEEP. Perfect for families or groups looking to relax and have some playful competition.`,
  },
  {
    header: "Record Player and Sound System",
    text: `Unwind with some music using the record player and sound system available at THE KEEP. Bring your favorite records or enjoy the collection provided.`,
  },
];

export default function Activities({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Entertainment and Activities"
      sections={ActivitiesData}
    />
  );
}