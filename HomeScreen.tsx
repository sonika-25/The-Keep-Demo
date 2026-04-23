import React ,{useState,useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet,Image,PermissionsAndroid, Platform } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PLACES } from "./routeData";
import {Picker} from '@react-native-picker/picker'
import { playWelcome } from "./playWelcome";

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route:any
};

export default function HomeScreen({ navigation }: Props) {
  /*const [routeNumber, setRouteNumber] = useState<number | null>(null);
  const [opener,setOpener]=useState ("coming from?")
  const tripType = route?.params?.tripType ?? "arrival";
  const [dest,setDest]=useState("Hobart")*/
  const [fromPlace, setFromPlace] = useState<string>("");
  const [toPlace, setToPlace] = useState<string>("");
  const destinationOptions = PLACES.filter((p) => p.id !== fromPlace);

  async function requestLocationPermission() {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  }
  useEffect (()=>{
    const hasPermission = requestLocationPermission();
    console.log(hasPermission)
    playWelcome();
  },[])
  
  return (
    <View style={styles.container}>
        <Text style={styles.logoheader}>The Keep</Text>
        <Image
        
        source={require("./assets/logo.webp")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Where are you coming from?</Text>

    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={fromPlace}
        onValueChange={(value) => {
          setFromPlace(value);
          if (value === toPlace) {
            setToPlace("");
          }
        }}
        style={styles.picker}
      >
        <Picker.Item label="Select oriigin" value="" />
        {PLACES.map((place) => (
          <Picker.Item style={{alignItems:"center"}} key={place.id} label={place.name} value={place.id} />
        ))}
      </Picker>
    </View>

    <Text style={styles.heading}>Where are you going to?</Text>

    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={toPlace}
        onValueChange={(value) => setToPlace(value)}
        style={styles.picker}
        enabled={!!fromPlace}
      >
        <Picker.Item label="Select destination" value="" />
        {destinationOptions.map((place) => (
          <Picker.Item key={place.id} label={place.name} value={place.id} />
        ))}
      </Picker>
    </View>

    <TouchableOpacity
      style={[styles.button, (!fromPlace || !toPlace) && styles.buttonDisabled]}
      disabled={!fromPlace || !toPlace}
      onPress={() => {
        navigation.navigate("Map", {
          fromId: fromPlace,
          toId: toPlace,
        });
      }}
    >
      <Text style={styles.buttonText}>Go to Route</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: "#2e7d32",
    margin:10
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  heading:{
    color: "white",
    fontSize:22,
    fontWeight: "800",
    fontFamily: "CreatoDisplay-Bold",
    margin:10
  },
  pickerWrapper: {
    alignItems: "center",
    width: "85%",
    backgroundColor: "#2e7d32",
    borderRadius: 15,
    marginVertical: 10,
    overflow: "hidden",
    fontSize:16,
    justifyContent:"center"
},

picker: {
  alignItems: "center",
  marginLeft:10,
  width: "100%",
  color: "#ffffff",
  borderRadius:16,
},

buttonDisabled: {
  backgroundColor: "#666",
},
  logo: {
    width: 150,
    height: 120,
    marginBottom: 30,
  },
  logoheader:{
    fontSize:20,
    color:"green"
  }
});
