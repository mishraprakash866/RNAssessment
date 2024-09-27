import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from "../screens/Home";
import Dashboard from "../screens/Dashboard";
import Contact from "../screens/Contact";
import Profile from "../screens/Profile";
import { ROUTENAME } from "../config/Constants";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaProvider>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = 'caret-up-circle';

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Dashboard') {
                            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                        } else if (route.name === 'Contact') {
                            iconName = focused ? 'mail' : 'mail-outline';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#1e90ff',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        borderTopWidth: 0,
                        height: 60 + insets.bottom,
                        paddingBottom: insets.bottom,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: 'bold',
                    }
                })}
            >
                <Tab.Screen name={ROUTENAME.bottomstack.Home} component={Home} />
                <Tab.Screen name={ROUTENAME.bottomstack.Dashboard} component={Dashboard} />
                <Tab.Screen name={ROUTENAME.bottomstack.Contact} component={Contact} />
                <Tab.Screen name={ROUTENAME.bottomstack.Profile} component={Profile} />
            </Tab.Navigator>
        </SafeAreaProvider>
    );

}

export default BottomTabs;