import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth, firestore } from '../config/Firebase';
import { db } from '../config/sqliteDB';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GLOBALSTYLE, ROUTENAME } from '../config/Constants';

const Profile = ({ navigation }: any) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(false);

    useLayoutEffect(() => {
        callGetData();
    }, []);

    const handleLogout = async () => {
        try {
            await auth().signOut();
            (await db).transaction((tx) => {
                tx.executeSql('DELETE FROM users');
            });
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTENAME.Login }]
            });
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    const callGetData = async () => {
        try {
            const user = auth().currentUser;

            if (user) {
                (await db).transaction((tx: any) => {
                    tx.executeSql('SELECT * FROM users WHERE uid = ?', [user.uid], (tx: any, results: any) => {
                        if (results.rows.length > 0) {
                            setFullName(results.rows.item(0).fullName);
                            setEmail(results.rows.item(0).email);
                        }
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdate = async () => {
        try {
            setLoader(true);
            const user = auth().currentUser;
            if (user) {
                (await db).transaction((tx: any) => {
                    tx.executeSql('UPDATE users SET fullName = ?, email = ? WHERE uid = ?', [fullName, email, user.uid]);
                });

                // Update Firestore
                await firestore().collection('users').doc(user.uid).update({ fullName, email });

                Alert.alert('Profile updated successfully');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
            <Text style={styles.title}>Profile</Text>
            <TextInput
                placeholder="Full Name"
                value={fullName}
                placeholderTextColor="#777"
                onChangeText={setFullName}
                style={GLOBALSTYLE.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                placeholderTextColor="#777"
                onChangeText={setEmail}
                style={GLOBALSTYLE.input}
            />
            <TouchableOpacity disabled={loader} style={GLOBALSTYLE.button} onPress={handleUpdate}>
                {loader ?
                    <ActivityIndicator size={20} color={'#fff'} />
                    :
                    <Text style={GLOBALSTYLE.buttonText}>Update Profile</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity style={[GLOBALSTYLE.button, { backgroundColor: 'red' }]} onPress={handleLogout}>
                <Text style={GLOBALSTYLE.buttonText}>Logout</Text>
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

export default Profile;