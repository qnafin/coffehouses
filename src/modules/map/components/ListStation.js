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


import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsStation from '../../../actions/Station';

import i18n from '../../../i18n';

import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors';

import Loading from "../../../components/Loading"
import ButtonThema from "../../../components/ButtonThema";
import h from "../../../api/helper";


const ItemStation = ({separators, title, timeWork, address, image, distance, style, onPress, hiddenDistance}) => {
   
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
                            <View style={[styles.elipce, (!timeWork.active ? {backgroundColor: "black"} : null)]}/> 
                            <Text style={[styles.timeText, styles.littleText, (!timeWork.active ? {color: "black"} : {color: Colors.green})]}>
                                {timeWork.value} 
                            </Text>
                        </View>
                    </View>
                </View>
                {image 
                    ?   <View style={styles.imageBlock}>
                            <Image 
                                source={{uri: image}} 
                                resizeMode={"cover"} 
                                style={{width: 75, height: 75}}
                            />
                        </View> 
                : null}
            </View>
        </TouchableOpacity>
    )
}

class ListStation extends React.Component {
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
        let  {data, navigation, actions, hiddenDistance, style} = this.props
        if(data.length == 0) {
            return (<View style={style}>
                        <Loading style={{backgroundColor: "white"}}/>
                    </View>)
        }
        return (
            <View style={[style]}>
                <Text style={styles.title}>{i18n.t("list_station")}</Text>
                <FlatList
                    
                    ItemSeparatorComponent={ () => <View style={ styles.separator } /> }
                    keyExtractor={(item, index) => item.id.toString()}
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index, separators}) => (
                        <ItemStation 
                            title={item.name}
                            address={item.address}
                            timeWork={item.time_work}
                            distance={item.distance}
                            image={item.preview_src}
                            separators={separators}
                            hiddenDistance={hiddenDistance}
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
    stations: state.station.stations
  }),
  (dispatch) => ({
    actions: {
      station: bindActionCreators(ActionsStation, dispatch),
    }
  })
  )(ListStation);


const styles = StyleSheet.create({
    card: {
        padding: 20, 
        paddingLeft: 0,
        borderRadius: 15,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    name: {
        fontSize: 14,
        lineHeight: 19,
        marginBottom: 5,
        fontWeight: "bold",
    },
    title: {
        fontSize: 18,
        paddingBottom: 5,
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
        color: Colors.black,
        fontSize: 12,
        lineHeight: 16
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
        width: 6,
        height: 6,
        backgroundColor: Colors.green,
        borderRadius: 6,
        marginRight: 5,
        bottom: -1
    },
    infoBlock: {
        paddingRight: 10,
        width: Layout.window.width - 75 - 80,
    },
    littleText: {
        color: Colors.black,
        fontSize: 10
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
    }
})