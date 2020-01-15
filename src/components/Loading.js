import React from 'react';
import {
    ActivityIndicator,
    View,
    StyleSheet,
  } from 'react-native';

import Colors from '../constants/Colors';

export default function Loading({style}) {
  return (
    <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={Colors.grey} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F3",
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center'
    },  
    
});
