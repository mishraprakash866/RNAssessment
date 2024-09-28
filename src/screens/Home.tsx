import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Home = () => {
    return (
        <View style={{paddingTop: useSafeAreaInsets().top, flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text>Welcome to the Home Screen</Text>
        </View>
    );
}

export default Home;
