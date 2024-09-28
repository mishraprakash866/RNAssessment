import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, firestore } from '../config/Firebase';
import { GLOBALSTYLE, ROUTENAME } from '../config/Constants';
import { db } from '../config/sqliteDB';

const Login = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(false);

    const handleLogin = async () => {
        try {
            setLoader(true);
            const user = await auth().signInWithEmailAndPassword(email, password);
            if (user?.user?.uid) {

                const tempUserDoc = await firestore().collection('users').doc(user.user.uid).get();
                const tempUserData = tempUserDoc.data();

                (await db).transaction((tx) => {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS users (uid TEXT PRIMARY KEY, fullName TEXT, email TEXT, contact TEXT, address TEXT)');
                    tx.executeSql('INSERT INTO users (uid, fullName, email, contact, address) VALUES (?, ?, ?, ?, ?)', 
                        [
                            tempUserData?.uid, 
                            tempUserData?.fullName, 
                            tempUserData?.email, 
                            tempUserData?.contact || '',
                            tempUserData?.address || ''
                        ]
                    );
                });

                navigation.reset({
                    index: 0,
                    routes: [{ name: ROUTENAME.bottomstack.index }]
                })
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Please check credentials!!!');
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>

            <TextInput
                style={GLOBALSTYLE.input}
                placeholder="Email"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={GLOBALSTYLE.input}
                placeholder="Password"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity disabled={loader} style={GLOBALSTYLE.button} onPress={handleLogin}>
                {loader ?
                    <ActivityIndicator size={20} color={'#fff'} />
                    :
                    <Text style={GLOBALSTYLE.buttonText}>Login</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.link}
                onPress={() => navigation.navigate('Signup')}
            >
                <Text style={styles.linkText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9fafd',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#051d5f',
    },
    link: {
        marginTop: 20,
    },
    linkText: {
        color: '#1e90ff',
        fontSize: 16,
    }
})

export default Login;
