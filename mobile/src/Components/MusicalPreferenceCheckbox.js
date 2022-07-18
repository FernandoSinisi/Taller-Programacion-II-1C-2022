import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Checkbox, Text} from 'react-native-paper'
import { useMusicalContext } from '../context/MusicalPreferencesContext';


export default MusicalPreferenceCheckbox = ({name, type})=>{

    const {check, musicalPrefs} = useMusicalContext();
    
    return(
        <View style={styles.container}>
            <Checkbox
                status={ musicalPrefs[type] ? 'checked' : 'unchecked'}
                color={ musicalPrefs[type] ? 'skyblue':'grey'}
                onPress={()=>{check(type)}}
                />
            <Text>{name}</Text>
        </View>
        
    );
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center'
    }
})