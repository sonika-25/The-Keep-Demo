import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const bookData: InfoSection[] = [
  {
    header: "Looking to Book Again?",
    text: `We would love to have you stay at THE KEEP again! As a returning guest, you may be eligible for exclusive loyalty discounts. Please reach out to us directly to inquire about these special offers.

For bookings, feel free to contact Sue Stagg at admin@thekeeptasmania.com.au or call +61 0408484132. Sue will be delighted to assist you with your next stay.

While THE KEEP is available all year round, certain seasons may offer unique experiences in Tasmania. We recommend booking early to secure your preferred dates.

Additionally, if you're interested in exploring more properties by Tasmanian Unique Accommodation Pty Ltd, please let us know, and we can provide more information.

Remember, you can always check availability and book directly via our website[...] for the best rates. However, please be cautious about sharing direct booking links through OTA messaging platforms like Airbnb.

`,
  }
];

export default function BookAgain({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Looking to Book Again?"
      sections={bookData}
    />
  );
}