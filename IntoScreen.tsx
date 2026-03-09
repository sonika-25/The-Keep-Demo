import React ,{useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet,Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function IntroScreen({ navigation }: Props) {
  const [routeNumber, setRouteNumber] = useState<number | null>(null);

  return (
    <View style={styles.container}>
        <Text style={styles.logoheader}>The Keep</Text>
        <Image
        
        source={require("./assets/logo.webp")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Are you Leaving or Arriving at the Keep?</Text>
      <TouchableOpacity
      style = {styles.button}
      onPress={()=>{
        setRouteNumber(0);
        console.log(0)
        navigation.navigate("HomeScreen",{pageNum:0})
        }}>
        <Text style={styles.buttonText}> Leaving </Text>
        </TouchableOpacity>
      <TouchableOpacity
      style = {styles.button}
      onPress={()=>{
        setRouteNumber(1);
        console.log(1)
        navigation.navigate("HomeScreen",{pageNum:1})
        }}>
        <Text style={styles.buttonText}>Arriving</Text>
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