import React, { useEffect } from "react";
import { auth } from "../config/Firebase";
import { ROUTENAME } from "../config/Constants";

const OnBoard = ({navigation}: any) => {

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if(user){
                navigation.reset({
                    index: 0,
                    routes: [{name: ROUTENAME.bottomstack.index}]
                })
            }else{
                navigation.reset({
                    index: 0,
                    routes: [{name: ROUTENAME.Login}]
                })
            }
        });
        return () => unsubscribe();
      }, []);

    return (
        <>
            
        </>
    );

}

export default OnBoard;