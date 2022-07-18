import {useAuthUser} from "../context/AuthContext";
import React, {useEffect} from 'react'
import {View} from "react-native";

const ExitScreen = () => {
    const {signOut} = useAuthUser();

    useEffect( () => {
        signOut();
    }, [] );

    return (
        <View>

        </View>
    );
}

export {
    ExitScreen
}