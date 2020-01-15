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


class ModalDetailStation extends React.Component {
    componentDidMount() {
        let {actions} = this.props
        //actions.setting.setStyleHiddenSearch(true)
    }
    render() {
        let {
            isVisible, 
            onClose, 
            backdropOpacity, 
            item, 
            navigation, 
            actions, 
            isRent
        } = this.props

        if(!item) {
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
        } 
        
        let {active, name, address, time_work, powerbanks, slots} = item
        
        return (
            <ModalContainer 
                isVisible={isVisible} 
                onClose={() => onClose()}
                backdropOpacity={0.0}
            >
                <View style={{width: "100%"}}>
                    <View style={styles.card}>
                        <Text style={styles.name}>
                            {name}
                        </Text>
                        <View style={styles.timeWork}>
                            <View style={[styles.elipce, (!time_work.active) ? {backgroundColor: "black"} : null]}/> 
                            <Text style={[styles.timeText, (!time_work.active) ? {color: Colors.black} : null]}>{time_work.value}</Text>
                        </View>
                        <View style={styles.addressBlock}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <Text style={styles.addressText}>{address}</Text>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.infoBlock}>
                        <View style={styles.greyBlock}>
                            <View style={styles.battaryBlock}>
                                {[0, 1].map((item)=>{
                                    return (<View key={item}>
                                                <Image 
                                                    source={require("../../../assets/images/onboard/slide_point_active.png")} 
                                                    style={styles.battaryImg} 
                                                    resizeMode={"contain"}
                                                />
                                                <Image 
                                                    source={require("../../../assets/images/onboard/slide_point_active.png")} 
                                                    style={styles.battaryImg} 
                                                    resizeMode={"contain"}
                                                />
                                            </View>)
                                })}
                            </View>
                            <Text><Text style={styles.number}>{powerbanks}</Text> {h.num2str(powerbanks, i18n.t("arr_battary"))}</Text>
                        </View>
                        <View style={styles.greyBlock}>
                            <View style={styles.battaryBlock}>
                                {[0, 1].map((item)=>{
                                    return (<View key={item}>
                                                <Image 
                                                    source={require("../../../assets/images/onboard/slide_point.png")} 
                                                    style={styles.battaryImg} 
                                                    resizeMode={"contain"}
                                                />
                                                <Image 
                                                    source={require("../../../assets/images/onboard/slide_point.png")} 
                                                    style={styles.battaryImg} 
                                                    resizeMode={"contain"}
                                                />
                                            </View>)
                                })}
                            </View>
                            <Text><Text style={styles.number}>{slots}</Text> {h.num2str(slots, i18n.t("arr_slot"))}</Text>
                        </View>
                    </View>
                    {!isRent 
                    &&
                    <ButtonThema 
                        disabled={!active}
                        style={styles.submitButton}
                        text={i18n.t('take_charger')}
                        onPress={()=> {
                            onClose();
                            navigation.navigate('PaymentStation')
                            //actions.rent.createRent(item.id)
                        }}
                    /> 
                    }
                </View>
            </ModalContainer>
           
        )
    }
}


export default  connect(state => ({
  }),
  (dispatch) => ({
    actions: {
      setting: bindActionCreators(ActionsSetting, dispatch),
      rent: bindActionCreators(ActionsRent, dispatch)
    }
  })
  )(ModalDetailStation);

  

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
        backgroundColor: Colors.greyBackground,
        padding: 30, 
        width: "100%",
        borderRadius: 15,
        alignItems: "center",
        marginBottom: 30
    },
    name: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: "bold",
        textAlign: "center"
    },
    addressBlock: {
        backgroundColor: "white",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        padding: 8,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 30,
    },
    addressText: {
        color: Colors.black
    },  
    timeWork: {
        paddingTop: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    timeText: {
        color: Colors.green,
        fontSize: 10
    },
    elipce :{ 
        width: 6,
        height: 6,
        backgroundColor: Colors.green,
        borderRadius: 6,
        marginRight: 5,
        bottom: -1
    },
    infoBlock: {
        flexDirection: "row", 
        justifyContent: Layout.isSmallDevice ? "space-between" : "space-between",
        marginBottom: 30,
    },
    greyBlock: {
        borderColor: Colors.litleGrey,
        borderWidth: Layout.isSmallDevice ? 0 : 1, 
        width: "45%",
        borderRadius: 15,
        padding: Layout.isSmallDevice ? 5 : 17, 
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    battaryBlock: {
        flexDirection: "row",
        marginRight: 10
    },
    battaryImg: {
        width: 17, 
        height: 7, 
        marginRight: 3,
        marginBottom: 3
    },
    number: {
        fontWeight: "bold",
        fontSize: 14
    }
})