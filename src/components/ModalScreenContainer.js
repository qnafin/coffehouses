import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet
} from 'react-native';


import i18n from '../i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import ThemaStyle from '../constants/ThemaStyle';
import Colors from '../constants/Colors'


class ModalScreenContainer extends Component {
  state = {
   
  };

  handleScrollTo = p => {
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo(p);
    }
  };

  render() {
    let { children,} = this.props
    return (
      <SafeAreaView style={styles.container}>
          <View style={styles.modal}>
                <View style={styles.content}>
                    <View style={styles.close}></View>
                    <View>
                      {children}
                    </View>
                </View>
          </View>
      </SafeAreaView>
    
    )
  }
}


export default ModalScreenContainer;

const styles = StyleSheet.create({
      container: {
        flex: 1 , justifyContent: 'flex-end',  backgroundColor: 'transparent',
      },
      modal: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        borderRadius: 20,
        top: 100,
        overflow: "hidden",
        backgroundColor: 'white',
        paddingTop: 0
      },
      content: {
        alignItems: 'center', 
        justifyContent: 'center', 
       
      },
      close: {
        width: 60,
        height: 4,
        backgroundColor: "#E2E2E2",
        borderRadius: 100,
        marginBottom: 20,
        top: 20
      },
     
})