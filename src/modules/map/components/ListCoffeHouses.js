import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  ScrollView,
  StyleSheet
} from 'react-native';

import h from "../../../api/helper";

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsStation from '../../../actions/Station';

import i18n from '../../../i18n';

import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors';

import Loading from "../../../components/Loading"
import ButtonThema from "../../../components/ButtonThema";
import ThemaStyle from '../../../constants/ThemaStyle';
import IconInfo from "../../../components/icon/IconInfo"

const Item = ({separators, title, timeWork, address, image, distance, style, onPress, hiddenDistance, description}) => {
    image = "https://wallbox.ru/resize/800x480/wallpapers/main/201127/6a82ee918f7f942a7b2e68a5d865697c.jpg";
    return(
       
        <TouchableOpacity
            onPress={onPress}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}
        >
            <View style={styles.card}>
                <View style={[styles.infoBlock, !image ? {width: "100%"} :  null]}>
                    <Text style={styles.name}>
                        {title}
                    </Text>
                    <Text style={styles.addressText}>
                        {address}
                    </Text>
                    <View style={[styles.timeWork, {paddingTop: 10}]}>
                        {!hiddenDistance && <Text style={[styles.littleText, {paddingRight: 18}]}>
                            {h.distanceFormat(distance)}
                        </Text>}
                        <View style={styles.timeWork}>
                            <Text style={[styles.timeText, styles.littleText]}>
                                {timeWork.value} 
                            </Text>

                            <View style={[styles.elipce, (!timeWork.active ? {backgroundColor: "black"} : null)]}/> 
                            
                            {description  && 
                            <View style={styles.description}>
                                <Text style={styles.whiteText}>{description}</Text>
                            </View>
                            }
                            
                        </View>
                    </View>
                </View>
                {image 
                    ?   <View style={styles.imageBlock}>
                            <Image 
                                source={{uri: image}} 
                                resizeMode={"cover"} 
                                style={{width: 65, height: 65, borderRadius: 4}}
                            />
                            <IconInfo color={"white"} style={{position: "absolute", bottom: 4, right: 4}}/>
                        </View> 
                : null}
            </View>
        </TouchableOpacity>
    )
}

class ListCoffeHouses extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
      
      };
      this.page = 1;
    }
    _onPressItem(item) {
        let  {data, navigation, actions, onClose} = this.props
        navigation.navigate('Map')
        actions.station.goToStation({
            latitude: item.coordinates.lat, 
            longitude: item.coordinates.lon,  
            idStation: item.id, 
            timeout: 1500
        })
        if(typeof onClose == 'function') {
            onClose()
        }
    }
    render() {
        let  {data, navigation, actions, hiddenDistance, style, access_mode} = this.props
        if(data.length == 0) {
            return (<View style={style}>
                        <Loading style={{backgroundColor: "white"}}/>
                    </View>)
        }
        return (
            <View style={[style]}>
                <Text style={styles.title}>{i18n.t("select_coffehouses")}</Text>
                <FlatList
                    
                    ItemSeparatorComponent={ () => <View style={ styles.separator } /> }
                    keyExtractor={(item, index) => item.id.toString()}
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index, separators}) => (
                        <Item 
                            title={item.name}
                            address={item.address}
                            timeWork={item.time_work}
                            distance={item.distance}
                            image={item.preview_src}
                            separators={separators}
                            hiddenDistance={hiddenDistance}
                            description={ access_mode ? "по пропускам" : "по пропускам"}
                            onPress={()=>this._onPressItem(item)}
                        />
                    )}
                    onEndReached={ ()=>{
                        let {actions} = this.props
                        let page = this.page + 1;

                        if(this.page != page) {
                            actions.station.getStationListPage({latitude: null, longitude: null}, page).then((res) => {
                                this.page = page;
                            })
                        
                        }
                    }}
                    onEndReachedThreshold={0.9}
                /> 
            </View>
            
        )
    }
}

export default  connect(state => ({
    stations: state.coffehouses.stations
  }),
  (dispatch) => ({
    actions: {
      station: bindActionCreators(ActionsStation, dispatch),
    }
  })
  )(ListCoffeHouses);


const styles = StyleSheet.create({
    card: {
        padding: 13, 
        paddingHorizontal: 0,
        borderRadius: 15,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    name: {
        fontSize: ThemaStyle.fontSize20,
        lineHeight: 19,
        marginBottom: 5,
        fontWeight: "bold",
    },
    title: {
        fontSize: ThemaStyle.fontSize22,
        paddingBottom: 10,
        fontWeight: "bold"
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
        fontSize: ThemaStyle.fontSize15,
    },  
    timeWork: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center"
    },
    timeText: {
        color: Colors.green,
    },
    elipce :{ 
        width: 8,
        height: 8,
        backgroundColor: Colors.green,
        borderRadius: 8,
        marginLeft: 5,
        bottom: -1
    },
    infoBlock: {
        paddingRight: 10,
        width: Layout.window.width - 65 - 80,
    },
    littleText: {
        color: Colors.grey,
        fontSize: ThemaStyle.fontSize15
    },
    number: {
        fontWeight: "bold",
        fontSize: 14
    },
    separator: { 
        width: "100%", 
        height: 1, 
        backgroundColor: "#E2E2E2" 
    },
    imageBlock: {
        borderRadius: 4,
        overflow: "hidden",
    }, 
    description: {
        backgroundColor: Colors.grey, 
        borderRadius: 32, 
        marginLeft: 5
    },
    whiteText: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        color: "white"
    }
})