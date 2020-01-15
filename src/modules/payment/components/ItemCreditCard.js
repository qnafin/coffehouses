import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import Colors from "../../../constants/Colors"
import ThemaStyle from '../../../constants/ThemaStyle'

const ItemCreditCard = ({source, onPress, card_number, style, card_date,  shadow}) => {
  return(
    <TouchableOpacity onPress={onPress ? onPress : ()=>{}} disabled={true}>
      <View style={[styles.button, styles.shadow]}>
        {source && <Image source={source} style={styles.image} />}
        <Text style={[styles.textButton, style]}>{card_number.toString().slice(-4)}</Text>
        <Text style={[styles.textButton, style]}>{card_date}</Text>
        <Text style={[styles.textButton, style]}>{"* * *"}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ItemCreditCard;

const styles = StyleSheet.create({
  shadow: {
    borderWidth: 1,
    borderColor: "#ececec"
  },
  button: {
    backgroundColor: "white",
    alignItems: "center",
    height: 60,
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
    marginBottom: 5,
    flexDirection: "row"
  },
  textButton: {
    color: Colors.black,
    fontSize: 18
  },
  image: {
      width: 43,
      height: 30
  }
});
