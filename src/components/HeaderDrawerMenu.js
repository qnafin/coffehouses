import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsUser from '../actions/User';
import helper from '../api/helper'
import Colors from '../constants/Colors';

const HeaderDrawerMenu = ({onPress, user}) => {
  if(!user) return null
  let {phone} = user
 
  if(phone) {
    return (
      <View style={styles.container}>
              
              <TouchableOpacity style={{}} onPress={onPress}>
            
                  <Text style={styles.city}>{'г. Москва'}</Text>
                  <Text style={styles.phone}>{phone} </Text>
  
              </TouchableOpacity>
          </View>
    );
  } else {
    return null
  }

}
export default connect(state => ({
    user: state.user,
  }),
  (dispatch) => ({
    actions: {
      user: bindActionCreators(ActionsUser, dispatch),
    }
  })
  )(HeaderDrawerMenu);

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        minHeight: 120,
        alignItems: "center",
        flexDirection: "row",
        paddingRight: "8%",
        paddingLeft: "8%"
        
    },  
    city: {
      marginBottom: 10,
      color: Colors.black
    },
    phone: {
        fontSize: 17,
        fontWeight: "normal",
        color: Colors.theme
    },
    description: {
        fontSize: 16,
        color: "#ADADC0",
        paddingTop: 5
    },
});
