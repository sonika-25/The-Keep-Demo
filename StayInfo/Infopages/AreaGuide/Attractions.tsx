import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const natureData: InfoSection[] = [
  {
    header: "St Columba Falls",
    text: "One of Tasmania's highest waterfalls, St Columba Falls is a breathtaking sight located just 30 minutes from THE KEEP. The short walk to the falls is through lush rainforest, making it a perfect nature escape.",
  },
  {
    header: "Blue Tier Reserve",
    text: "Explore the stunning landscapes of the Blue Tier Reserve, located about 40 minutes from THE KEEP. It's ideal for hiking and mountain biking, with trails that offer spectacular views of the surrounding wilderness.",
  },
];

export default function Attractions({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Attractions"
      sections={natureData}
    />
  );
}