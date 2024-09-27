import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { auth, firestore } from '../config/Firebase';
import { db } from '../config/sqliteDB';

const Profile = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

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
        }
    };

    return (
        <View>
            <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <Button title="Update Profile" onPress={handleUpdate} />
        </View>
    );
}

export default Profile;