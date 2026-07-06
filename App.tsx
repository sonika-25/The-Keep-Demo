
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import MapScreen from './Navigation/Pages/MapScreen';
import StartScreen from './Navigation/Pages/StartScreen'
import HomeScreen from './Navigation/Pages/HomeScreen';
//import Welcome from './StayInfo/Infopages/welcome';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainInfo from './StayInfo/Maininfo';
import Welcome from './StayInfo/Infopages/WecomePage'
import ToBring from './StayInfo/Infopages/BeforeLeave/ToBring';
import PreArrival from './StayInfo/Infopages/BeforeLeave/PreArrival';
import ShopOptions from './StayInfo/Infopages/BeforeLeave/ShopOptions';
import LocalWeather from './StayInfo/Infopages/BeforeLeave/LocalWeather';
import Amenities from './StayInfo/Infopages/AboutAccom/Amenities';
import ArrivalInfo from './StayInfo/Infopages/Arrival';
import Appliances from './StayInfo/Infopages/AboutAccom/Applicances';
import Inside from './StayInfo/Infopages/AboutAccom/Inside';
import Outside from './StayInfo/Infopages/AboutAccom/Outside';
import Rules from './StayInfo/Infopages/AboutAccom/Rules';
import WifiSection from './StayInfo/Infopages/Wifi';
import Regs from './StayInfo/Infopages/Safety/Regs';
import Safetyinfo from './StayInfo/Infopages/Safety/Safetyinfo';
import Contact from './StayInfo/Infopages/Contact';
import Dining from './StayInfo/Infopages/AreaGuide/Dining';
import Attractions from './StayInfo/Infopages/AreaGuide/Attractions';
import Shopping from './StayInfo/Infopages/AreaGuide/Shopping';
import Transportation from './StayInfo/Infopages/AreaGuide/Transportation';
import Activities from './StayInfo/Infopages/AreaGuide/Activities';
import HostRecs from './StayInfo/Infopages/AreaGuide/HostRecs';
import Thanks from './StayInfo/Infopages/Farewell/Thanks';
import Departure from './StayInfo/Infopages/Farewell/Departure';
import Touch from './StayInfo/Infopages/Farewell/Touch';
import BookAgain from './StayInfo/Infopages/BookAgain';
import SearchScreen from './SearchScreen';
const Stack = createNativeStackNavigator()
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="StartScreen"  screenOptions={{headerShown: false}}>   
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Info" component={MainInfo} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="ToBring" component={ToBring} /> 
        <Stack.Screen name="Map" component={MapScreen} /> 
        <Stack.Screen name="PreArrival" component={PreArrival} /> 
        <Stack.Screen name="ShopOptions" component={ShopOptions} /> 
        <Stack.Screen name="LocalWeather" component={LocalWeather} /> 
        <Stack.Screen name="ArrivalInfo" component={ArrivalInfo} /> 
        <Stack.Screen name="Amenities" component={Amenities} /> 
        <Stack.Screen name="Appliances" component={Appliances} /> 
        <Stack.Screen name="Inside" component={Inside} /> 
        <Stack.Screen name="Outside" component={Outside} /> 
        <Stack.Screen name="Rules" component={Rules} /> 
        <Stack.Screen name="Wifi" component={WifiSection} /> 
        <Stack.Screen name="Regs" component={Regs} /> 
        <Stack.Screen name="Safety" component={Safetyinfo} /> 
        <Stack.Screen name="Contact" component={Contact} /> 
        <Stack.Screen name="Dining" component={Dining} /> 
        <Stack.Screen name="Attractions" component={Attractions} /> 
        <Stack.Screen name="Shopping" component={Shopping} /> 
        <Stack.Screen name="Transportation" component={Transportation} /> 
        <Stack.Screen name="Activities" component={Activities} /> 
        <Stack.Screen name="Hostrecs" component={HostRecs} /> 
        <Stack.Screen name="Thanks" component={Thanks} /> 
        <Stack.Screen name="Departure" component={Departure} /> 
        <Stack.Screen name="Touch" component={Touch} /> 
        <Stack.Screen name="BookAgain" component={BookAgain} /> 

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
