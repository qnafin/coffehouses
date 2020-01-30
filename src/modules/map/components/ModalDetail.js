import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  StyleSheet
} from 'react-native';


import Icon from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionsSetting from '../../../actions/Setting'

import i18n from '../../../i18n';

import Loading from "../../../components/Loading"
import ThemaStyle from '../../../constants/ThemaStyle';
import Layout from "../../../constants/Layout";
import Colors from '../../../constants/Colors'

import ButtonThema from "../../../components/ButtonThema"
import h from "../../../api/helper"

import SwipeablePanel from "../../../components/swipeable_panel";

const FULL_HEIGHT = Layout.window.height;
const IS_SMALL_DEVICE = Layout.isSmallDevice
console.log('FULL_HEIGHT', FULL_HEIGHT,  Layout.window.width, IS_SMALL_DEVICE)
class ModalDetail extends React.Component {
    componentDidMount() {
        let {actions} = this.props
    }
    openPanel = () => {
        this.setState({ swipeablePanelActive: true });
    }
    closePanel = () => {
        let { onClose } = this.props
        onClose()
    }
    render() {
        let {
            isActive, 
            onClose, 
            backdropOpacity, 
            item, 
            navigation, 
            actions, 
            isRent
        } = this.props

        if(!item) {
            return (
                <SwipeablePanel
                    fullWidth
                    isActive={isActive}
                    onClose={this.closePanel}
                    openPanel={this.openPanel}
                    onPressCloseButton={this.closePanel}
                    style={{borderRadius: 10,}}
                    noBackgroundOpacity={true}
                    closeOnTouchOutside={true}
                    modalFullHeight={false}
                    noBar={true}
                    showCloseButton={true}
                    allowFullClose={false}
                    modalFullHeight={false}
                    heightSmall={290}
                    heightLarge={!IS_SMALL_DEVICE ? FULL_HEIGHT * 0.13 : null}
                >
                    <View style={{height: 300, width: "100%"}}>
                        <Loading style={{backgroundColor: "white"}}/>
                    </View>
                </SwipeablePanel>
            )
        } 
        
        let {active, name, address, time_work, image, title, description, phone} = item
        image = "https://i09.fotocdn.net/s120/387cf6d4b245a9ae/public_pin_m/2755106781.jpg";
        title = "Как добраться"
        description = "Выходите из метро «Чистые пруды» и идете вдоль Чистопрудного бульвара по правой стороне. Вход в кофейню справа от кинотеатра «Ролан»."
        phone="+79999999999"
        return (
            <SwipeablePanel
                fullWidth
                isActive={isActive}
                onClose={this.closePanel}
                openPanel={this.openPanel}
                onPressCloseButton={this.closePanel}
                style={{borderRadius: 10,}}
                noBackgroundOpacity={true}
                closeOnTouchOutside={true}
                modalFullHeight={false}
                noBar={true}
                showCloseButton={true}
                allowFullClose={false}
                modalFullHeight={false}
                heightSmall={290}
                heightLarge={!IS_SMALL_DEVICE ? FULL_HEIGHT * 0.14 : null}
            >       
                <ScrollView style={{width: "100%",  marginBottom: 50, }}>
                    <View style={styles.card}>
                        <Text style={styles.name}>
                            {name}
                        </Text>
                        <Text style={styles.addressText}>{address}</Text>
                        
                        <ButtonThema 
                            disabled={!active}
                            style={styles.submitButton}
                            text={i18n.t('select')}
                            onPress={()=> {
                                onClose();
                                navigation.navigate('PaymentStation')
                                //actions.rent.createRent(item.id)
                            }}
                        /> 
                        {image 
                        && 
                        <Image 
                            source={{uri: image}} 
                            style={styles.image}
                            resizeMode={"cover"}
                        />
                        }
                        {title 
                        && 
                        <Text style={styles.title}>{title}</Text>
                        }
                        {description 
                        && 
                        <View style={styles.descriptionBlock}>
                            <Text style={styles.description}>{description}</Text>
                        </View>
                        }
                        <View style={styles.footer}>
                            <View style={styles.timeWork}>
                                <Text style={[styles.timeText]}>
                                    {time_work.value}
                                </Text>
                                <View style={[styles.elipce, (!time_work.active) ? {backgroundColor: "black"} : null]}/> 
                            </View>
                            {phone && (
                                <TouchableOpacity onPress={()=>{Linking.openURL(`tel://${phone}`)}}>
                                    <View style={styles.callBlock}>
                                        <Icon name={"phone"} size={20} color={Colors.grey} />
                                        <Text style={styles.callText}>{i18n.t("to_call")}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        
                    </View>
                    
                </ScrollView>

            </SwipeablePanel>
           
        )
    }
}


export default  connect(state => ({
  }),
  (dispatch) => ({
    actions: {
      setting: bindActionCreators(ActionsSetting, dispatch),
    }
  })
  )(ModalDetail);

  

const styles = StyleSheet.create({
    submit: {
        bottom: 40,
        position: "absolute",
        left: 30,
        right: 30
    },
    submitButton: {
        height: 56,
        marginVertical: 20 
    },
    card: {
        flex: 1,
        padding: 30, 
        width: "100%",
        borderRadius: 15,
        marginBottom: 30
    },
    name: {
        fontSize: ThemaStyle.fontSize22,
        lineHeight: 26,
        fontWeight: "bold",
        textAlign: "left",
        color: Colors.black,
        marginBottom: 5
    },
    image: {
        width: "100%", 
        height: 200,
        borderRadius: 8,
        marginBottom: 20
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
        color: Colors.grey,
        fontSize: ThemaStyle.fontSize17
    },  
    timeWork: {
        paddingTop: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        justifyContent: "center"
    },
    timeText: {
        color: Colors.black,
        fontSize: ThemaStyle.fontSize17
    },
    elipce :{ 
        width: 8,
        height: 8,
        backgroundColor: Colors.green,
        borderRadius: 6,
        marginLeft: 5,
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
    },
    title: {
        fontSize: ThemaStyle.fontSize20,
        color: Colors.black,
        fontWeight: "bold",
        marginBottom: 10
    },
    descriptionBlock: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomColor: "#ccc",
        borderBottomWidth: 0.5
    },
    description: {
        fontSize: ThemaStyle.fontSize17,
        lineHeight: ThemaStyle.fontSize20,
        color: Colors.black,
    },
    callBlock: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 4
    },
    callText: {
        color: ThemaStyle.grey,
        fontSize: ThemaStyle.fontSize17,
        color: Colors.grey,
        marginLeft: 5
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",

        alignContent: "center",
        alignItems: "center",
    }
})