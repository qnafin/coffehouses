import React from 'react';
import {
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity
} from 'react-native';
import Colors from "../constants/Colors"

const Link = ({url, text, style}) => {
    return (
        <Text onPress={
            ()=>url ? Linking.openURL(url).catch(err => console.error('An error occurred', err)) : {}
        } 
              style={[styles.text, style]}>
              {text}
        </Text>
    )
}
export default Link;

const styles = StyleSheet.create({
    text: {
        color: Colors.green
    }
 });