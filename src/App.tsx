import React, { useLayoutEffect, useState } from "react";
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import Main from "./stacks/Main";
import { StyleSheet, Text, View } from "react-native";

const App = () => {

  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useLayoutEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup the subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {isConnected ?
      <Main />
      :
        <View style={styles.container}>
          <Text style={styles.title}>You are offline! 🔴</Text>
        </View>
      }
    </>
  );

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      paddingHorizontal: 20,
  },
  title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
  }
});

export default App;