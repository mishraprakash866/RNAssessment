import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, firestore } from '../config/Firebase';
import { db } from '../config/sqliteDB';
import { GLOBALSTYLE, ROUTENAME } from '../config/Constants';
import moment from 'moment';

const Signup = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loader, setLoader] = useState(false);

    const handleSignup = async () => {
        try {
            setLoader(true);
            const user = await auth().createUserWithEmailAndPassword(email, password);
            const userData = { uid: user.user.uid, fullName, email, createdAt: moment().toString() };

            await firestore().collection('users').doc(user.user.uid).set(userData);

            const tempUser = await auth().signInWithEmailAndPassword(email, password);
            if(tempUser?.user?.uid){

                (await db).transaction((tx) => {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS users (uid TEXT PRIMARY KEY, fullName TEXT, email TEXT, contact TEXT, address TEXT)');
                    tx.executeSql('INSERT INTO users (uid, fullName, email) VALUES (?, ?, ?)', [userData.uid, fullName, email]);
                });

                navigation.reset({
                    index:0,
                    routes:[{name:ROUTENAME.bottomstack.index}]
                })

            }else{
                navigation.navigate('Login');
                Alert.alert('Message', 'User Registered Successfully.')
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Email address already exist!');
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                style={GLOBALSTYLE.input}
                placeholder="Full Name"
                placeholderTextColor="#777"
                value={fullName}
                onChangeText={setFullName}
            />

            <TextInput
                style={GLOBALSTYLE.input}
                placeholder="Email"
                keyboardType='email-address'
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

            <TouchableOpacity disabled={loader} style={GLOBALSTYLE.button} onPress={handleSignup}>
                {loader ?
                    <ActivityIndicator size={20} color={'#fff'} />
                    :
                    <Text style={GLOBALSTYLE.buttonText}>Sign Up</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.link}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.linkText}>Already have an account? Log in</Text>
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
});

export default Signup;