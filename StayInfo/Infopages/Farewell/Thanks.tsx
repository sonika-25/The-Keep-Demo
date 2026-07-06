import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const thanksData: InfoSection[] = [
  {
    header: "Thank You",
    title: "Thank You for Staying with us",
    image:require('../../../assets/thanks.jpg'),
    text: `Thank you for staying with us at THE KEEP, and we hope you enjoyed your stay in beautiful Goulds Country, Tasmania.


If there were any issues with your stay, please don't hesitate to tell us, as we want to ensure we can resolve them for the next guest.

We love online reviews!

When you're prompted to leave a review please give us a star rating, and write a sentence or two about what you liked the best during your stay.

Was it the comfy bed? The detailed information and local recommendations? Or maybe the location itself?

If you are unable to leave us 5 stars, please don't hesitate to contact us first to let us know why - you are key to helping us improve. We take all feedback onboard.

Thank you!

`,
  },
];

export default function Thanks({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Thanks"
      sections={thanksData}
    />
  );
}