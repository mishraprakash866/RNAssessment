import { Dimensions, StyleSheet } from "react-native"

export const ROUTENAME = {
    Login: 'Login',
    Signup: 'Signup',
    OnBoard: 'OnBoard',
    bottomstack: {
        index: 'BottomTabs',
        Contact: 'Contact',
        Dashboard: 'Dashboard',
        Home: 'Home',
        Profile: 'Profile',
        UserList: 'UserList'
    }
}

export const THEMESTYLE = {
    D_Width: Dimensions.get('window').width,
    D_Height: Dimensions.get('window').height
}

export const GLOBALSTYLE = StyleSheet.create({
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
    }
})