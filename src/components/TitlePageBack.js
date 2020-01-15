import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import {DrawerActions} from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons';

const TitlePageBack = ({name, onPress, openMenu, navigation, isInverted}) => {
  return (
    <TouchableOpacity
      style={[styles.header, isInverted ? { color: '#fff' } : {}]}
      onPress={() => {
        onPress ? onPress() : navigation.goBack();
        if (openMenu) {
          navigation.dispatch(DrawerActions.toggleDrawer())
        }
      }}
    >
      <Icon name="ios-arrow-back" size={26} style={[styles.icon, isInverted ? { color: '#fff' } : {}]}/>
      <Text style={[styles.text, isInverted ? { color: '#fff' } : {}]}>{name}</Text>
    </TouchableOpacity>
  )
}

export default TitlePageBack;

const styles = StyleSheet.create({

  header: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    paddingBottom: 15,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold"
  },
  icon: {
    paddingRight: 25
  }
})
