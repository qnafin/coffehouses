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


import i18n from '../../../i18n';

import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors';

import Loading from "../../../components/Loading";
import h from "../../../api/helper";
import ThemaStyle from '../../../constants/ThemaStyle';
import DistanceText from "../components/DistanceText";

const ItemAddress = ({separators, title, coordinates, address, onPress, style}) => {
    return(
        <TouchableOpacity
            onPress={onPress}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}
        >
            <View style={styles.card}>
                <Text style={styles.name}>{title}</Text>
                <DistanceText 
                    latitude={coordinates.lat} 
                    longitude={coordinates.lon}
                    style={styles.distanceText}
                />
            </View>
        </TouchableOpacity>
    )
}
const ListAddress = ({data, onPres, navigation, actions, onClose}) => {
    if(data.length == 0) 
        return <Text>ЕСЛИ ПОЛЕ ПОИСКА ПУСТОЕ, ДОЛЖЕН БЫТЬ ВЕСЬ СПИСОК ЗАВЕДЕНИЙ</Text>
   
    return (
      <FlatList
        ItemSeparatorComponent={ () => <View style={ styles.separator } /> }
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index, separators}) => (
            <ItemAddress
                title={item.marker}
                address={item.formatted_address}
                separators={separators}
                coordinates={item.geometry.coordinates}
                onPress={() => {
                    console.log(item)
                    return false
                    navigation.navigate('Map')
                    actions.search.goToAddress({
                        latitude: item.geometry.coordinates.lat, 
                        longitude: item.geometry.coordinates.lon
                    })
                    if(typeof onClose == 'function') {
                        onClose()
                    }
                }}
            />
        )}
    /> 
    )
}

export default ListAddress;

const styles = StyleSheet.create({
    card: {
        width: "96%",
        padding: 11, 
        paddingHorizontal: 0, 
        flexDirection: "row",
        justifyContent: "space-between"
    },
    name: {
        fontSize: ThemaStyle.fontSize17,
        lineHeight: 19,
        color: Colors.black,
        width: "80%",
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
        marginLeft: 18,
        bottom: -1
    },
    infoBlock: {
        paddingRight: 10,
        width: Layout.window.width - 75 - 80,
    },
    littleText: {
        fontSize: 10
    },
    number: {
        fontWeight: "bold",
        fontSize: 14
    },
    separator: { 
        width: "100%", 
        height: 0.5, 
        backgroundColor: "#ccc" 
    },
    imageBlock: {
        borderRadius: 4,
        overflow: "hidden",
    },
    distanceText: {
        color: Colors.grey
    }
})