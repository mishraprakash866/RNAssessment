import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { ROUTENAME } from "../config/Constants";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import BottomTabs from "./BottomTabs";
import OnBoard from "../screens/OnBoard";

const Stack = createStackNavigator();

const Main = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={ROUTENAME.bottomstack.index} screenOptions={{headerShown:false}}>
                <Stack.Screen name={ROUTENAME.OnBoard} component={OnBoard} />
                <Stack.Screen name={ROUTENAME.Login} component={Login} />
                <Stack.Screen name={ROUTENAME.Signup} component={Signup} />
                <Stack.Screen name={ROUTENAME.bottomstack.index} component={BottomTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );

}

export default Main;