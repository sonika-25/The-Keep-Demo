import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const DepartureData: InfoSection[] = [
  {
    header: "Check-out Time",
    title: "Check-out time is strictly 10:00 AM.",
    text: `If you require a later check-out, we’ll do our best to accommodate it. But please bear in mind you’ll need to let us know beforehand.


If we have guests arriving that day it will be almost impossible to offer a late check-out due to the cleaners needing to prepare for those guests.
    `,
  },
  {
    header: "Check-out Process",
    title: "Check-out time is strictly 10:00 AM.",
    text: `Before your departure, we’d appreciate if you would take care of the following:
• Leave the beds unmade
• Place used towels in the shower
• Load & run the dishwasher
• Empty all the trash into the bins provided outside
• Set thermostat to 72F / 22C
• Lock all doors & windows

For key return, please use the lockbox provided for self check-in and check-out.

We hope you had a wonderful stay and wish you safe travels back home!
`,
  },

];

export default function Departure({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Departure Information"
      sections={DepartureData}
    />
  );
}