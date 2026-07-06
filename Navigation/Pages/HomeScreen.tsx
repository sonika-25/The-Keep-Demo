import React ,{useState,useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet,Image,PermissionsAndroid, Platform } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PLACES, type PlaceKey } from "../utils/routeData";
import {Picker} from '@react-native-picker/picker'
import { playWelcome } from "../utils/playWelcome";
import Navbar from "../../components/Navbar";
type Props = {
  navigation: NativeStackNavigationProp<any>;
  route:any
};

export default function HomeScreen({ navigation }: Props) {

  const [fromPlace, setFromPlace] = useState<string>("");
  const [toPlace, setToPlace] = useState<string>("");
  const [stops, setStops] = useState<PlaceKey[]>([]);
  const destinationOptions = PLACES.filter((p) => p.id !== fromPlace);
  const stopOptions = PLACES.filter(
    (p) => p.id !== fromPlace && p.id !== toPlace
  );
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
          <Navbar
          title="THE KEEP"
          leftText="Back"
          onLeftPress={() => navigation.goBack()}
          />
        <Image
        
        source={require("../../assets/logo.webp")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Where are you coming from?</Text>

    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue=""
        onValueChange={(value) => {
          setFromPlace(value);
          if (value === toPlace) {
            setToPlace("");
          }
        }}
        style={styles.picker}
      >
        <Picker.Item style={styles.pickerText} label="Select origin" value="" />
        {PLACES.map((place) => (
          <Picker.Item style={{fontFamily: 'CormorantGaramond-Regular',alignItems:"center"}} key={place.id} label={place.name} value={place.id} />
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
        <Picker.Item label="Select destination" value=""style={styles.pickerText} />
        {destinationOptions.map((place) => (
          <Picker.Item style={styles.pickerText}key={place.id} label={place.name} value={place.id} />
        ))}
      </Picker>
    </View>
    <Text style={styles.heading}>Add Stops</Text>

<View style={styles.pickerWrapper}>
  <Picker
    style={styles.picker}

    selectedValue=""
    onValueChange={(value: PlaceKey | "") => {
      if (!value) return;

      setStops((prev) => {
        if (prev.includes(value)) return prev;
        return [...prev, value];
      });
    }}
    enabled={!!fromPlace && !!toPlace}
  >
    <Picker.Item label="Add a stop" value="" style={styles.pickerText} />
    {stopOptions
      .filter((stop) => !stops.includes(stop.id))
      .map((stop) => (
        <Picker.Item style={styles.pickerText} key={stop.id} label={stop.name} value={stop.id} />
      ))}
  </Picker>
    </View>

    <View style={styles.selectedStopsContainer}>
      {stops.map((stopId) => {
        const stop = PLACES.find((p) => p.id === stopId);

        if (!stop) return null;

        return (
          <TouchableOpacity
            key={stop.id}
            style={styles.stopChip}
            onPress={() => {
              setStops((prev) => prev.filter((id) => id !== stop.id));
            }}
          >
            <Text style={styles.stopChipText}>{stop.name} ×</Text>
          </TouchableOpacity>
        );
      })}
    </View>
    <TouchableOpacity
      style={[styles.button, (!fromPlace || !toPlace) && styles.buttonDisabled]}
      disabled={!fromPlace || !toPlace}
      onPress={() => {
        navigation.navigate("Map", {
          fromId: fromPlace,
          toId: toPlace, 
          stops: stops 
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
  selectedStopsContainer: {
  width: "85%",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: 6,
},

stopChip: {
  backgroundColor: "#333",
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 12,
  margin: 4,
  borderWidth: 1,
  borderColor: "#236426",
},
pickerText:{
  fontFamily: 'CormorantGaramond-Regular'
},
stopChipText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "600",
  fontFamily: 'CormorantGaramond-Medium',
},
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: "#236426",
    margin:10
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: 'CormorantGaramond-SemiBold',
  },
  heading:{
    color: "white",
    fontSize:23,
    fontFamily: 'CormorantGaramond-Bold',
    margin:10
  },
  pickerWrapper: {
    alignItems: "center",
    width: "85%",
    backgroundColor: "#236426",
    borderRadius: 15,
    marginVertical: 10,
    overflow: "hidden",
    fontSize:16,
    justifyContent:"center",
    fontFamily: 'CormorantGaramond-Regular',
},

picker: {
  alignItems: "center",
  marginLeft:10,
  width: "100%",
  color: "#ffffff",
  borderRadius:16,
  fontFamily: 'CormorantGaramond-Regular',

},

buttonDisabled: {
  backgroundColor: "#666",
},
  logo: {
    width: 150,
    height: 120,
    marginBottom: 30,
    marginTop:30
  },
  logoheader:{
    fontSize:20,
    color:"green",

  }
});
