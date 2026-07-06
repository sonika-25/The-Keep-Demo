import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage, { InfoSection } from "../components/InfoAccordionPage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const contactData: InfoSection[] = [
  {
    header: "Host Contact Information",
    text: "If you need to reach your host, please contact Sue Stagg at:\n\nPhone: +61 0408484132\n\nEmail: admin@thekeeptasmania.com.au",
  },
  {
    header: "Emergency Services",
    text: "For any emergencies, please contact the following services:\n\nPolice, Fire, Ambulance: 000",
  },
  {
    header: "Local Medical Facilities",
    text: "For medical assistance, you can visit the nearest facility:\n\nSt Helens District Hospital: +61 3 6387 5570",
  },
  {
    header: "Local Pharmacies",
    text: "For pharmacy needs, contact:\n\nSt Helens Pharmacy: +61 3 6376 1374",
  },
  {
    header: "Maintenance Staff",
    text: "If you need to get hold of our maintenance staff, you can reach them by calling:\n\n[...]\n\nThis phone line is available during these hours [.....AM - ....PM]",
  },
  {
    header: "Housekeepers / Cleaners",
    text: "If you need to get hold of our housekeeper/cleaner, you can reach them by calling:\n\n[...]\n\nThis phone line is available during these hours [.....AM - ....PM]",
  },
];

export default function Contact({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Contact"
      sections={contactData}
    />
  );
}