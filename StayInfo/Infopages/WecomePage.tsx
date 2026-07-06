import { InfoSection } from "../components/InfoAccordionPage";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InfoAccordionPage from "../components/InfoAccordionPage";
export const welcomeData: InfoSection[] = [
  {
    title: "Welcome to THE KEEP in beautiful Goulds Country, Tasmania!",
    header: "Personalized Greeting",
    text: "I'm Sue Stagg, your host, and I'm thrilled to have you here. Our property is part of the Tasmanian Unique Accommodation collection, and we take pride in offering a unique and memorable experience.",
  },
  {
    header: "Introduction to THE KEEP",
    text: "THE KEEP is a secluded retreat nestled in the stunning landscapes of Tasmania. Our property offers a perfect blend of luxury and nature, providing you with a tranquil escape from the hustle and bustle of everyday life.",
  },
  {
    header: "Highlights of Your Stay",
    text: "Relax in our private hot tub, available all year round, and enjoy the breathtaking views of the surrounding countryside. Unwind in our entertainment area featuring a record player, sound system, and life-size games for endless fun. Indulge in a gourmet experience with our fully equipped kitchen, perfect for creating your own culinary masterpieces.",
  },
  {
    title: "Welcome to Guide",
    header: "Welcome",
    text: `Welcome 👋 Here’s everything you need to know about your stay with us
Your time is precious, which is why we've created this digital guidebook. Think of it as having us "virtually" by your side, answering everything you need to know about staying with us. Things like:
• how to find us
• the WiFi code
• check-in instructions
• check-out instructions
• wonderful local places
• excellent restaurants
Don't forget the SEARCH option in the menu at the bottom of the page. You can also access it by tapping here`,
    image: require("../../assets/welcomeImage.jpg"),
  },
  {
    title: "",
    header: "Looking Forward to Your Stay",
    text: "We are excited to have you at THE KEEP and are committed to making your stay as comfortable and enjoyable as possible. If you have any questions or need assistance, feel free to reach out to me at admin@thekeeptasmania.com.au. Enjoy your stay",
  },
];


type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function Welcome({ navigation }: Props) {
  return (
    <InfoAccordionPage
      navigation={navigation}
      title="Welcome"
      sections={welcomeData}
    />
  );
}