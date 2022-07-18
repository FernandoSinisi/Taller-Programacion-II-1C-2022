import React, {useState} from 'react';
import DropDown from 'react-native-paper-dropdown';
import genre from "../data/Genre"

const GenreDropDown = (props) => {
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <DropDown
      label={'Género*'}
      mode={'outlined'}
      visible={showDropDown}
      showDropDown={() => setShowDropDown(true)}
      onDismiss={() => setShowDropDown(false)}
      value={props.value}
      setValue={props.setValue}
      list={Object.values(genre)}
    />
  );
}

export default GenreDropDown;
