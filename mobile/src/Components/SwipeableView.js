import React, {useEffect, useState} from 'react';
import {View} from "react-native";

const SwipeableView = ({style, children, onSwipeLeft, onSwipeRight, onPress}) => {
  const [touchStartX, setTouchStartX] = useState(0);

  const handleTouchEnd = (touchEndX) => {
    if (touchEndX > touchStartX) {
      onSwipeRight && onSwipeRight();
    } else if (touchEndX < touchStartX) {
      onSwipeLeft && onSwipeLeft();
    } else {
      onPress && onPress();
    }
  }

  return (
    <View
      style={style}
      onTouchStart={e => setTouchStartX(e.nativeEvent.pageX)}
      onTouchEnd={e => handleTouchEnd(e.nativeEvent.pageX)}
    >
      {children}
    </View>
  )
}

export default SwipeableView;
