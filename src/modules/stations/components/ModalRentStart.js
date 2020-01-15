import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet
} from 'react-native';


import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionsSetting from '../../../actions/Setting'
import * as ActionsRent from "../../../actions/Rent"

import i18n from '../../../i18n';
import Modal from "react-native-modal";
import ModalContainer from "../../../components/ModalContainer"

import Loading from "../../../components/Loading"
import Icon from 'react-native-vector-icons/Ionicons';
import ThemaStyle from '../../../constants/ThemaStyle';
import Layout from "../../../constants/Layout";
import Colors from '../../../constants/Colors'

import ButtonThema from "../../../components/ButtonThema"
import h from "../../../api/helper"


class ModalRentStart extends React.Component {
    componentDidMount() {
        let {actions} = this.props
        //actions.setting.setStyleHiddenSearch(true)
    }
    render() {
        let {
            isVisible, 
            onClose, 
            socket_rent_start, 
            rent_loader, 
            backdropOpacity, 
            actions, 
            navigation
        } = this.props
        
        if( rent_loader && socket_rent_start == null) {
            return (
                <ModalContainer 
                    isVisible={isVisible} 
                    onClose={() => onClose()}
                    backdropOpacity={0.0}
                >
                    <View style={{height: 300, width: "100%"}}>
                        <Loading style={{backgroundColor: "white"}}/>
                    </View>
                </ModalContainer>
            )
        } else if(socket_rent_start == null)  {
            return null
        } else {
            actions.rent.getRent()
        }
        return (
            <ModalContainer 
                isVisible={isVisible} 
                onClose={() => onClose()}
                backdropOpacity={0.0}
            >
                <View style={{width: "100%"}}>
                    <View style={styles.card}>
                        <Text style={styles.name}>
                            {socket_rent_start.title}
                        </Text>
                        <Text style={styles.text}>
                            {socket_rent_start.text}
                        </Text>
                        <Image source={{uri: socket_rent_start.image}} style={styles.image} resizeMode={"contain"}/>
                    </View>
                </View>
            </ModalContainer>
        )
    }
}


export default  connect(state => ({
    socket_rent_start: state.socket.rent_start,
    rent_loader: state.rent.loader
  }),
  (dispatch) => ({
    actions: {
      setting: bindActionCreators(ActionsSetting, dispatch),
      rent: bindActionCreators(ActionsRent, dispatch)
    }
  })
  )(ModalRentStart);

  

const styles = StyleSheet.create({
    submit: {
        bottom: 40,
        position: "absolute",
        left: 30,
        right: 30
    },
    submitButton: {
        height: 60
    },
    card: {
        width: "100%",
        borderRadius: 15,
        alignItems: "center",
    },
    name: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10
    },
    text: {
        fontSize: 17,
        color: Colors.black,
        lineHeight: 26,
        textAlign: "center",
        marginBottom: 20
    },
    image: {
        width: "100%",
        height: 180
    }
})