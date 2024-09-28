import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { firestore } from "../config/Firebase";

type ITEMType = {
    fullName: string,
    email: string,
    uid: string,
    contact?: string,
    address?: string
}

type RenderItemType = {
    item: ITEMType,
    index?: number
}

const UserList = () => {
    const [users, setUsers] = useState<ITEMType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsersFromDB();
    }, []);

    const fetchUsersFromDB = async () => {
        try {
            const usersCollection = await firestore().collection('users').get();
            const fetchedUsers:any[] = usersCollection.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Error fetching users from Firestore:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderUserItem = ({ item }: RenderItemType) => (
        <View style={styles.userCard}>
            <Text style={styles.fullName}>{item.fullName}</Text>
            <Text style={styles.email}>{item.email}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#1e90ff" />
                <Text>Loading users...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>User Signup List</Text>

            {users.length === 0 ? (
                <Text style={styles.noUsersText}>No users found.</Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item: ITEMType) => item.uid}
                    renderItem={renderUserItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    listContainer: {
        paddingBottom: 20,
        gap: 10
    },
    userCard: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    fullName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1e90ff",
    },
    email: {
        fontSize: 16,
        color: "#555",
        marginTop: 5,
    },
    noUsersText: {
        fontSize: 18,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default UserList;
