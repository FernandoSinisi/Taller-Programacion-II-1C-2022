import {Text} from "react-native-paper";
import {ScrollView} from "react-native";
import React from "react";

const contentTitleStyle = {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 35
};

const contentTextStyle = {
    textAlign: 'left',
    fontSize: 20,
    marginBottom: 10
};

const emojiStyle = {
    textAlign: 'center',
    fontSize: 45,
    marginBottom: 10
};

const artistNameStyle = {
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 35
};

const contentButtonStyle = {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 90,
    backgroundColor: 'white',
};

const pressedContentButtonStyle = {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 90,
    backgroundColor: 'lightblue',
};

export {
    contentTitleStyle,
    artistNameStyle,
    contentTextStyle,
    emojiStyle,
    contentButtonStyle,
    pressedContentButtonStyle
}
