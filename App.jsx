import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';


const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="home" component={HomeScreen} options={{headerShown: false}}/>
      <Stack.Screen name="details" component={DetailsScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
