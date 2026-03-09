import React ,{useState,useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet,Image,PermissionsAndroid, Platform } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: Props) {
  const [routeNumber, setRouteNumber] = useState<number | null>(null);
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
  },[])
  
  return (
    <View style={styles.container}>
        <Text style={styles.logoheader}>The Keep</Text>
        <Image
        
        source={require("./assets/logo.webp")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Where are you coming from? </Text>
      <TouchableOpacity
      style = {styles.button}
      onPress={()=>{
        setRouteNumber(0);
        console.log(0)
        navigation.navigate("Map",{routeNumber:0})
        }}>
        <Text> Hobart </Text>
        </TouchableOpacity>
      <TouchableOpacity
      style = {styles.button}
      onPress={()=>{
        setRouteNumber(1);
        console.log(1)
        navigation.navigate("Map",{routeNumber:1})
        }}>
        <Text>Launceston</Text>
        </TouchableOpacity>
        <TouchableOpacity
      style = {styles.button}
      onPress={()=>{
        setRouteNumber(2);
        console.log(1)
        navigation.navigate("Map",{routeNumber:2})
      }}>
        <Text>Mokosz</Text>
        </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Map",{routeNumber})}
      >
        <Text style={styles.buttonText}>Go to Map</Text>
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