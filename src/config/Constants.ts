import { Dimensions } from "react-native"

export const ROUTENAME = {
    Login: 'Login',
    Signup: 'Signup',
    OnBoard: 'OnBoard',
    bottomstack:{
        index: 'BottomTabs',
        Contact: 'Contact',
        Dashboard: 'Dashboard',
        Home: 'Home',
        Profile: 'Profile',
    }
}

export const THEMESTYLE = {
    D_Width: Dimensions.get('window').width,
    D_Height: Dimensions.get('window').height
}