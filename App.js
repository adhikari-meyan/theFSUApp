import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/HomeScreen';
import ConnectScreen from './screens/ConnectScreen';
import CalendarScreen from './screens/CalendarScreen';
import ContactScreen from './screens/ContactScreen';
import AboutScreen from './screens/AboutScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home': iconName = 'home'; break;
              case 'Connect': iconName = 'link'; break;
              case 'Calendar': iconName = 'calendar'; break;
              case 'Contact FSU': iconName = 'phone'; break;
              case 'About Us': iconName = 'info-circle'; break;
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1a73e8',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Connect" component={ConnectScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Contact FSU" component={ContactScreen} />
        <Tab.Screen name="About Us" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;