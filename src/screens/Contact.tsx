import React, { useLayoutEffect, useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth, firestore } from '../config/Firebase';
import { db } from '../config/sqliteDB';
import { GLOBALSTYLE } from '../config/Constants';

const Contact = () => {
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [loader, setLoader] = useState(false);

  useLayoutEffect(() => {
    callGetData();
  }, []);

  const callGetData = async () => {
    try {
      const user = auth().currentUser;

      if (user) {
        (await db).transaction((tx: any) => {
          tx.executeSql('SELECT * FROM users WHERE uid = ?', [user.uid], (tx: any, results: any) => {
            if (results.rows.length > 0) {
              setContact(results.rows.item(0).contact || '');
              setAddress(results.rows.item(0).address || '');
            }
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async () => {
    try {
      Keyboard.dismiss();
      setLoader(true);
      const user = auth().currentUser;
      if (user) {
        (await db).transaction((tx: any) => {
          tx.executeSql('UPDATE users SET contact = ?, address = ? WHERE uid = ?', [contact, address, user.uid]);
        });

        // Update Firestore
        await firestore().collection('users').doc(user.uid).update({ contact, address });

        Alert.alert('Contact information updated successfully');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
      <Text style={styles.title}>Contact Us</Text>

      <TextInput
        style={GLOBALSTYLE.input}
        placeholder="Enter your contact number"
        placeholderTextColor="#777"
        keyboardType="phone-pad"
        value={contact}
        onChangeText={setContact}
      />
      <TextInput
        style={[GLOBALSTYLE.input, { height: 100, textAlignVertical: 'top' }]}
        multiline={true}
        placeholder="Enter your address (optional)"
        placeholderTextColor="#777"
        keyboardType="default"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity disabled={loader} style={GLOBALSTYLE.button} onPress={handleSubmit}>
        {loader ?
          <ActivityIndicator size={20} color={'#fff'} />
          :
          <Text style={GLOBALSTYLE.buttonText}>Submit</Text>
        }
      </TouchableOpacity>
    </View>
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

export default Contact;