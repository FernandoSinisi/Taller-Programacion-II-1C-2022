import React, {useState} from 'react';
import DropDown from 'react-native-paper-dropdown';
import subscription from "../data/Subscription"

const SubscriptionDropDown = (props) => {
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <DropDown
      label='Suscripción*'
      mode={'outlined'}
      visible={showDropDown}
      showDropDown={() => setShowDropDown(true)}
      onDismiss={() => setShowDropDown(false)}
      value={props.value}
      setValue={props.setValue}
      list={Object.values(subscription)}
    />
  );
}

export default SubscriptionDropDown;
