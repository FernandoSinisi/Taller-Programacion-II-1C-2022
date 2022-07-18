import React from 'react';
import {TextInput} from 'react-native-paper';



export default EditProfileTextInput = (props) =>{    

    return(
        <TextInput
            mode='flat'
            name={props.name}
            label={props.label}
            value={props.input}
            onChangeText={ (text)=> {props.execute({type: props.name, value: text})}}
            activeOutlineColor='#f5fcff'
            theme={{colors: {text: 'darkblue' }}}
            style={props.styles}
            />
    )


}