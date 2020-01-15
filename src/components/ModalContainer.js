import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';


import i18n from '../i18n';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';
import ThemaStyle from '../constants/ThemaStyle';
import Colors from '../constants/Colors'


class ModalContainer extends Component {
  state = {
    visibleModal: null,
    scrollOffset: null,
  };

  scrollViewRef;


  handleOnScroll = event => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
    });
  };

  handleScrollTo = p => {
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo(p);
    }
  };

  render() {
    let {isVisible, onClose, children, opacity = 0.0} = this.props
    return (
      <Modal
        isVisible={isVisible}
        onSwipeComplete={() => onClose()}
        swipeDirection="down"
        animationInTiming={300}
        onBackButtonPress={() => onClose()}
        onBackdropPress={() => onClose()}
        backdropOpacity={opacity}
        style={styles.bottomModal}>
        
            <View style={styles.scrollableModal}>
              <View style={{borderRadius: 15, overflow: "hidden"}}>
                  <View style={styles.scrollableModalContent}>
                      <View style={styles.close}></View>
                      
                      {children}
                  </View>
              </View>
            </View>
      </Modal>
    )
  }
}


export default ModalContainer;

const styles = StyleSheet.create({
  
      scrollableModal: {
       padding: 15,
       maxHeight: "90%"
      },
      scrollableModalContent: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        width: "100%",
        paddingTop: 10,
        paddingBottom: 35
      },
    
      scrollableModalContent1: {
        height: 200,
        backgroundColor: '#87BBE0',
        alignItems: 'center',
        justifyContent: 'center',
      },
      scrollableModalText1: {
        fontSize: 20,
        color: 'white',
      },
      scrollableModalContent2: {
        height: 200,
        backgroundColor: '#A9DCD3',
        alignItems: 'center',
        justifyContent: 'center',
      },
      scrollableModalText2: {
        fontSize: 20,
        color: 'white',
      },
      close: {
        width: 60,
        height: 4,
        backgroundColor: "#E2E2E2",
        borderRadius: 100,
        marginBottom: 20
      },
     
      bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
      },
})