import React,{useState} from 'react';
import Switch from '@mui/material/Switch';





const AdminSwitch = (props) => {

    const [checked, setChecked] = useState((props.defaultOn)? ! props.initialState: props.initialState);

    let args = [ ! checked , props.itemId ];

    if ( props.itemType !== undefined ) args.push(props.itemType);

    return (
        <div>
            <Switch 
                checked={checked}
                onChange={async (e) => {
                    props.executeOnChange(...args);
                    setChecked( ! checked); }}
                inputProps={props.input}/>
        </div>
    )
}

export {
    AdminSwitch
}