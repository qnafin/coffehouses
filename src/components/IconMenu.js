import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import ThemaStyle from '../constants/ThemaStyle'
import Colors from "../constants/Colors"
import i18n from '../i18n';

export default function IconMenu({navigation, style, color}) {
  return (
    <TouchableOpacity 
      onPress={()=>{
        navigation.dispatch(DrawerActions.toggleDrawer())
      }}
    >
      <View style={[styles.rondoButton, styles.shadow, {backgroundColor: "white"}]}>
        <Text style={styles.text}>{i18n.t('menu')}</Text>
      </View>
  </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  shadow: ThemaStyle.shadow,
  text: {
    fontWeight: "bold",
    color: Colors.black
  },  
  rondoButton: {
    width: 66,
    height: 40,
    borderRadius: 48,
    alignContent: "center",
    justifyContent: 'center',
    alignItems: "center",
  }
})