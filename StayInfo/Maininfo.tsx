// src/MainInfo.tsx
import React , {useState} from "react";
import { View, Text, TouchableOpacity,Dimensions , StyleSheet, Image, FlatList, ListRenderItem, ImageSourcePropType } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Navbar from "../components/Navbar";
import DialogBox from "./components/DialogBox";
type Props = {
    navigation: NativeStackNavigationProp<any>;
};
type DialogItem = {
    label: string;
    navigator?: string;
};
type ItemData = {
    key:number,
    text: string;
    icon: React.ReactNode;
    navigator?: string
    dialogItems?: DialogItem[];

};
type ItemProps = {
    item: ItemData;
};
const screenHeight = Dimensions.get("window").height;
const itemHeight = screenHeight / 5;
const ICON_SIZE = 48;

const iconStyle = {
  width: ICON_SIZE,
  height: ICON_SIZE,
  tintColor: "#ffffff",
};
const itemData: ItemData[] = [
  {
    key: 0,
    text: "Welcome",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/icons8/ios7/256/Hands-Hand-icon.png",
        }}
      />
    ),
    navigator:"Welcome"
  },
  {
    key: 1,
    text: "Before You Leave Home",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/steve/zondicons/256/List-icon.png",
        }}
      />
    ),
    dialogItems: [
      { label: "Don't Forget to Bring", navigator: "ToBring" },
      { label: "Pre-Arrival Communication", navigator: "PreArrival" },
      { label: "Local Shopping Options", navigator: "ShopOptions" },
      { label: "Local Weather", navigator: "LocalWeather" },
    ],

  },
  {
    key: 2,
    text: "Arrival Information",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/icons8/ios7/256/Very-Basic-Key-icon.png",
        }}
      />
    ),
    navigator:'ArrivalInfo'
  },
  {
    key: 3,
    text: "About the Accommodation",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/pictogrammers/material-home/256/home-edit-outline-icon.png",
        }}
      />
    ),
    dialogItems: [
      { label: "Property Layout and Amenities", navigator: "Amenities" },
      { label: "Appliance Instructions / Information", navigator: "Appliances" },
      { label: "Enjoying Your Time Inside", navigator: "Inside" },
      { label: "Enjoying Your Time Outside", navigator: "Outside" },
      { label: "Property Rules", navigator: "Rules" },
    ],

  },
  {
    key: 4,
    text: "WiFi / Internet Details",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/icons8/ios7/256/Network-Wifi-Logo-icon.png",
        }}
      />
    ),
    navigator:"Wifi"

  },
  {
    key: 5,
    text: "Safety Info & Rules",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/pictogrammers/material/256/book-open-outline-icon.png",
        }}
      />
    ),
    dialogItems: [
      { label: "Rules and Regulations", navigator: "Regs" },
      { label: "Safety Information", navigator: "Safety" },
      
    ],
  },
  {
    key: 6,
    text: "Useful Contacts",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/icons8/ios7/256/Mobile-Phone-1-icon.png",
        }}
      />
    ),
    navigator:"Contact"

  },
  {
    key: 7,
    text: "Your Local Area Guide",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/icons8/ios7/256/Maps-Location-icon.png",
        }}
      />
    ),
    dialogItems: [
      { label: "Dining", navigator: "Dining" },
      { label: "Attractions", navigator: "Attractions" },
      { label: "Shopping", navigator: "Shopping" },
      { label: "Transportation", navigator: "Transportation" },
      { label: "Entertainment and Activities", navigator: "Activities" },
      { label: "Host Reccomendations", navigator: "Hostrecs" },
    ],


  },
  {
    key: 8,
    text: "So Long, Farewell!",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/icons8/ios7/256/Travel-Suitcase-icon.png",
        }}
      />
    ),
    dialogItems: [
      { label: "Thank You", navigator: "Thanks" },
      { label: "Departure Information", navigator: "Departure" },
      { label: "Please stay in touch", navigator: "Touch" },
    ],

  },
  {
    key: 9,
    text: "Book Again",
    icon: (
      <Image
        style={iconStyle}
        source={{
          uri: "https://icons.iconarchive.com/icons/github/octicons/256/star-24-icon.png",
        }}
      />
    ),
    navigator:"BookAgain"

  },
];


export default function MainInfo({ navigation }: Props) {
    const [hideDialogWhileNavigating, setHideDialogWhileNavigating] = useState(false);
    const [selectedDialog, setSelectedDialog] = useState<ItemData | null>(null);
    const Item = ({ item }: ItemProps) => {
        return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                if (item.dialogItems) {
                  setSelectedDialog(item);
                } else if (item.navigator) {
                  navigation.navigate(item.navigator);
                }
              }}
            >
                {item.icon} 
                <Text style={styles.itemText}>{item.text}</Text>
            </TouchableOpacity>
        );
    };
    React.useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        setHideDialogWhileNavigating(false);
      });

      return unsubscribe;
    }, [navigation]);
    return (
        <View style={styles.app}>
            <View>
                <Navbar
                title="Welcome"
                leftText="Back"
                onLeftPress={() => navigation.goBack()}
                />
            </View>
            <FlatList 
            contentContainerStyle={styles.flat}

            data={itemData}
            numColumns={2}
            renderItem={Item}
            keyExtractor={(item) => String(item.key)}
            />
           <DialogBox
            visible={selectedDialog !== null && !hideDialogWhileNavigating}
            onClose={() => setSelectedDialog(null)}
            title={selectedDialog?.text ?? ""}
            items={
              selectedDialog?.dialogItems?.map((dialogItem) => ({
                label: dialogItem.label,
                onPress: () => {
                  if (dialogItem.navigator) {
                    setHideDialogWhileNavigating(true);
                    navigation.navigate(dialogItem.navigator);
                  }
                }
              })) ?? []
            }
          />
        </View>
    );
}

const styles = StyleSheet.create({
    app: {
        flex: 1,
        width: "100%",
    },

    flat: {
        flexGrow: 1,
    },

    item: {
        width: "50%",
        height: itemHeight,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#236426",
        borderWidth: 1.5,
        borderColor: "#fff",
    },
    itemText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "500",
        color: "#ffffff",
        textAlign: "center",
        width: "85%",
        alignSelf: "center",
        paddingTop:10,
        fontFamily: 'Cinzel-SemiBold',
        }

});