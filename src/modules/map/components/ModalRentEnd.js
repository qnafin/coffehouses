import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
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
import Link from "../../../components/Link"
import ButtonThema from "../../../components/ButtonThema"
import h from "../../../api/helper"


class ModalRentEnd extends React.Component {
    componentDidMount() {
        let {socket_rent_end, actions} = this.props
        if(socket_rent_end == null) {
            return null
        } else {
            actions.rent.getRent()
        }
    }
    render() {
        let {isVisible, onClose, socket_rent_end, backdropOpacity, actions, navigation} = this.props
        if(socket_rent_end == null) {
            return null
        } 
        let {
            time_start, 
            time_end, 
            text, 
            title, 
            price_format, 
            rent_id
        } = socket_rent_end
        let time = h.upTime(time_start, time_end)
        let day_text = time.day == 0 ? i18n.t("time") : time.day + " " + h.num2str(time.day, i18n.t('arr_day'))
        return (
            <ModalContainer 
                isVisible={isVisible} 
                onClose={() => onClose()}
                backdropOpacity={0.0}
            >
                <View style={{width: "100%"}}>
                    <View style={styles.card}>
                        <Text style={styles.name}>
                            {title}
                        </Text>
                        <Text style={styles.text}>
                            {text}
                        </Text>
                        <View style={styles.greyBlock}>
                            <View style={{paddingRight: 50}}>
                                <Text style={[styles.litleText]}>
                                    {day_text}
                                </Text>
                                <Text style={styles.textValue}>{time.time}</Text>
                            </View>
                            <View>
                                <Text style={[styles.litleText]}>{i18n.t('cost')}</Text>
                                <Text style={styles.textValue}>{price_format}</Text>
                            </View>
                        </View>
                        {rent_id 
                            && <TouchableOpacity 
                                    style={{paddingVertical: 30}}
                                    onPress={()=>{
                                        navigation.navigate("Checks", {rent_id: rent_id})
                                        onClose()
                                    }}
                                > 
                                <Text style={{color: Colors.theme}}>{i18n.t('view_checks')}</Text>
                            </TouchableOpacity>}
                       
                        <ButtonThema text={"Закрыть окно"} onPress={()=>onClose()}/>
                    </View>
                </View>
            </ModalContainer>
        )
    }
}


export default  connect(state => ({
    socket_rent_end: state.socket.rent_end
  }),
  (dispatch) => ({
    actions: {
      setting: bindActionCreators(ActionsSetting, dispatch),
      rent: bindActionCreators(ActionsRent, dispatch)
    }
  })
  )(ModalRentEnd);

  

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
    },
    greyBlock: {
        backgroundColor: "#F8F8F8",
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 30
    },
    litleText: {
        fontSize: 12,
        marginBottom: 5,
        color: Colors.black
    },
    textValue: {
        fontSize: 14
    }
})