import {SafeAreaView, ScrollView, View} from "react-native";
import {Chip} from "react-native-paper";
import React from "react";
import {Text} from "react-native-paper";

import {
    chipStyle,
} from "../styles/listStyles";

const ListComponent = (usersList,
                       screen,
                       navigation) => {
    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    {
                        usersList.map( (user, id)=>{
                            return (
                                <Chip id={id}
                                      key={user.id}
                                      style={chipStyle}
                                      onPress={ ()=> {
                                        navigation.navigate(screen,
                                                           {uid: user.id})
                                      }
                                }>
                                    <View style={{flexDirection:'row'}}>
                                        <View >
                                            <Text>{user.username}</Text>
                                        </View>
                                    </View>
                                </Chip>
                            )})
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ListComponent;
