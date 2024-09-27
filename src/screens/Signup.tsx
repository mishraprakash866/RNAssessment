import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { auth, firestore } from '../config/Firebase';
import { db } from '../config/sqliteDB';

const Signup = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSignup = async () => {
        try {
            const user = await auth().createUserWithEmailAndPassword(email, password);
            const userData = { uid: user.user.uid, fullName, email };

            // Save in Firestore
            await firestore().collection('users').doc(user.user.uid).set(userData);

            // Save in SQLite
            (await
                // Save in SQLite
                db).transaction((tx) => {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS users (uid TEXT PRIMARY KEY, fullName TEXT, email TEXT)');
                    tx.executeSql('INSERT INTO users (uid, fullName, email) VALUES (?, ?, ?)', [userData.uid, fullName, email]);
                });

            navigation.navigate('Login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
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
    input: {
        width: '90%',
        height: 50,
        backgroundColor: '#e8f0fe',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1e90ff',
        width: '90%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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