import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const touchData: InfoSection[] = [
  {
    header: "Follow us on Social",
    text: `We'd love to see you over on our social pages. Just click on the links below and start following us!

Twitter:[...]
Facebook:[...]
Instagram:[...]

We'll then keep you updated with news about our place and the area

`,
  },
  {
    header:"Join Our Mailing List",
    text:`
    If you'd like to join our mailing list and keep in touch, please let us know, or sign-up here[...].


We promise, no spam, just informative and interesting content!


NOTE: Be careful including a mailing list signup link, if you will share your guide link with guests through the OTA messaging platforms. Airbnb, for example, are very strict about sharing links that solicit guest emails being sent through their messaging tool.

`
  }
];

export default function Touch({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Please Stay in Touch"
      sections={touchData}
    />
  );
}