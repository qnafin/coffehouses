import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
  SafeAreaView,
  View,
} from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'

import _ from "lodash";
import i18n from '../../../i18n'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';

import * as ActionsUser from "../../../actions/User"
import * as ActionsStation from '../../../actions/Station'
import * as ActionsSetting from '../../../actions/Setting'

import HeaderMenu from "../../../components/HeaderMenu"
import Colors from '../../../constants/Colors'

import ThemaStyle from '../../../constants/ThemaStyle'
import IconFilter from "../components/IconFilter"
import IconNavigator from "../components/IconNavigator"
import MarkerList from "../components/MarkerList"
import MarkerBulavka from "../components/MarkerBulavka"
import CustomLocationMarker from "../components/CustomLocationMarker"
import InputSearch from "../components/InputSearch"
import ButtonThema from "../../../components/ButtonThema"
import ModalDetailStation from "../components/ModalDetailStation"
import ModalListStation from "../components/ModalListStation"
import ModalRentStart from "../components/ModalRentStart"
import ModalRentEnd from '../components/ModalRentEnd'
import ModalSearch from "../components/ModalSearch"
import Overlay from "../../../components/Overlay"
import ActiveRent from "../components/ActiveRent"

const stylesMap = require("../stylesMap.json")

class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      followsUserLocation: false,
      modalDetailVisible: false,
      modalListVisible: false,
      modalSearchVisible: false,
      modalRentStart: false,
      modalRentEnd: false,
      initialRegion: {
        "latitude": 55.73103009027086, 
        "latitudeDelta": 0.20116519311886094, 
        "longitude": 37.62226173654199, 
        "longitudeDelta": 0.14918413013219833
      },
      activeMarkerID: null,
    };

    this.currentRegion = this.state.initialRegion

  }

  componentDidMount() {
    let {actions, permission_geolocation} = this.props;
    let {initialRegion} = this.state
    
   
    actions.station.getPoints(this.currentRegion)

    this.interval = setInterval(
      () => {
        actions.station.getPoints(initialRegion)
      },
      6000
    );
   

    actions.user.getGeolocationOfMemory().then((res) => {
      //получаем геопозицию с прошлой сессии
      this.currentRegion  = {...initialRegion, ...res}
      this.setState({initialRegion: this.currentRegion})
      this.animateToRegion(this.currentRegion)
    })
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.followLocation);
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }
  componentDidUpdate(prevProps, prevState) {
    let {followsUserLocation} = this.state
    let {
      active_marker, 
      bulavka, 
      permission_geolocation, 
      actions, 
      socket_rent_start, 
      socket_rent_end,
      rent_loader
    } = this.props

    if(prevState.followsUserLocation !== followsUserLocation) { 
     
      if(followsUserLocation) {
        //включена слежка за пользователем 
        this._getCurrentPosition()
      } 
      if(followsUserLocation == false) {
         //слежка отключена
        //clearInterval(this.followLocation);
      }
    }
    
    if(prevProps.active_marker !== active_marker) { 
      //перейти к маркеру
      if(active_marker.idStation != null) {
        console.log('active_marker.idStation', active_marker.idStation)
        setTimeout(() => {
          this._onPressMarker(active_marker)
        }, active_marker.timeout);
       
      } 
    }
    if(prevProps.socket_rent_start !== socket_rent_start) { 
      //открыть окно Взять зарадку и перейти к маркеру
      
      if(socket_rent_start != null) {
        let {station_id, coordinates} = socket_rent_start
        console.log('socket_rent_start.station_id', station_id)
        setTimeout(() => {
          this._onPressMarker({
            latitude: coordinates.lat, 
            longitude: coordinates.lon, 
            idStation: station_id
          })
          this.setState({modalRentStart: true, modalDetailVisible: false})
        }, 0);
       
      } 
    }
    if(prevProps.rent_loader !== rent_loader) { 
      //открыть окно Взять зарадку и перейти к маркеру
      if(rent_loader != null) {
          this.setState({modalRentStart: true, modalDetailVisible: false})
      } 
    }
    if(prevProps.socket_rent_end !== socket_rent_end) { 
      //открыть окно Аренда завершена
      
      if(socket_rent_end != null) {
        let {station_id, coordinates} = socket_rent_end
        console.log('socket_rent_end.station_id', station_id)
        setTimeout(() => {
          this._onPressMarker({
            latitude: coordinates.lat, 
            longitude: coordinates.lon, 
            idStation: station_id
          })
          this.setState({modalRentEnd: true, modalDetailVisible: false})
        }, 0);
       
      } 
    }
    
    if(prevProps.bulavka !== bulavka) { 
      //перейти к булавке
      this.animateToRegion(bulavka, 16)
      
    }
    if(prevProps.permission_geolocation !== permission_geolocation) { 
      if(permission_geolocation) {
        //перемещаемся к текущей геопозиции пользователя, если есть доступ
        this.setState({followsUserLocation: true})
      }
    }
    
  }
  _getCurrentPosition() {
    let {actions} = this.props
    actions.user.getCurrentPosition().then((position) => {
      this.animateToRegion(position.coords, 16);

      this.setState({followsUserLocation: false})
    })
  }
  _onPressMarker({latitude, longitude, idStation}) {
    
    let {actions} = this.props
    this.currentRegion = {
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      latitude: latitude * 0.999949,
      longitude: longitude 
    }
    this.setState({
        modalDetailVisible: true, 
        activeMarkerID: idStation
    }) 

    this.animateToRegion(this.currentRegion, zoom=16);

    actions.station.getStationDetail(idStation)

    actions.setting.setStyleHiddenHeader(true)
    actions.setting.setStyleHiddenSearch(true)

    //console.log('_onPressMarker', {latitude, longitude, idStation})
  }
  _onRegionChanged(event) {
    this.currentRegion = event

    //console.log(event)
  }
  _onUserLocationChanged(event) {
    let {followsUserLocation} = this.state
    const newRegion = event.nativeEvent.coordinate;
    
    this.currentRegion = {
      ...this.currentRegion,
      latitude: newRegion.latitude,
      longitude: newRegion.longitude
    };
    if(followsUserLocation) {
      this.animateToRegion(this.currentRegion);
    }
  }
  _onPanDrag(event) {
    this.setState({followsUserLocation: false})
  }
  animateToRegion(region, zoom=null) {
    if(this.map) {

      this.map.animateToRegion({
        latitude: this.currentRegion.latitude, 
        longitude: this.currentRegion.longitude,
        latitudeDelta: this.currentRegion.latitudeDelta, 
        longitudeDelta: this.currentRegion.longitudeDelta
      }, 1000);
      let animateCamera = {
        center: region, // should be { latitude, longitude }
        pitch: 10
      };
      if (zoom) {
        animateCamera.zoom = zoom;
      }
      this.map.animateCamera(
        animateCamera,
        { duration: 750 }
      );
    }
  }
  _onPressListStation() {
    let {actions, navigation} = this.props
    
    if(Platform.OS == "ios") {
      navigation.navigate('StationList')
      actions.setting.setStyleOverlay(true)
    } else {
      this.setState({modalListVisible: true})
    }
   
    actions.setting.setStyleHiddenHeader(true)
    actions.setting.setStyleHiddenSearch(true)
  }
  _onPressSearch() {
    let {actions, navigation} = this.props
    
    if(Platform.OS == "ios") {
      navigation.navigate('Search')
    } else {
      this.setState({modalSearchVisible: true})
    }
   
    actions.setting.setStyleHiddenHeader(true)
    actions.setting.setStyleHiddenSearch(true)
  }
  render () {
    let {
        navigation, 
        points, 
        detail, 
        setting_style, 
        actions, 
        pins, 
        permission_geolocation, 
        isRent
    } = this.props
    let {
      modalDetailVisible, 
      followsUserLocation, 
      activeMarkerID,
      modalSearchVisible,
      modalListVisible,
      modalRentStart,
      modalRentEnd,
    } = this.state

    let showHeader = !setting_style.hidden_header
    let showSearch = !setting_style.hidden_search
    //console.log("socket_rent_start", socket_rent_start)
    return (
        <SafeAreaView style={styles.container}>
          
          <MapView
            ref={el => (this.map = el)}
            provider={PROVIDER_GOOGLE}
            style={[styles.mapContainer]}
            //customMapStyle={stylesMap}
            showsUserLocation={true}
            showsMyLocationButton={true}
            onRegionChange={this._onRegionChanged}
            initialRegion={this.currentRegion}
            onPress={(e)=>console.log('press')}
            onPanDrag={(e)=>this._onPanDrag(e)}
            onUserLocationChange={(event) => {
              this._onUserLocationChanged(event)
            }}
            onMoveShouldSetResponder={()=>this.setState({followsUserLocation: false})}
            onRegionChange={(region) => {
              //console.log(region)
              this.currentRegion = region
            }}>
            
            {points.length > 0 && (
                 <MarkerList 
                    data={points} 
                    activeMarkerID={activeMarkerID}
                    isRent={isRent}
                    onPress={({latitude, longitude, idStation}) => {
                      actions.station.goToStation({latitude, longitude, idStation, timeout: 0})
                    }} 
                  />
            )}

            {pins.length > 0 && (
                 <MarkerBulavka 
                    data={[...pins]} 
                    onPress={({latitude, longitude}) => {}} 
                  />
            )}
            
              
          </MapView>
              
              {showHeader && (
                <HeaderMenu 
                  navigation={navigation} 
                  logo={true} 
                  rightButtton={
                      <IconFilter 
                          style={{}} 
                          onPress={()=>this._onPressListStation()}
                      />}
                  style={{position: "absolute", width: "100%"}}
                />
              )}
              {showSearch && (
                <InputSearch 
                  style={styles.inputSearch}
                  placeholder={i18n.t('search_by_street_or_metro')}
                  disabled={true}
                  onPress={()=>{}}
                />
              )}
              {showSearch && (
                <TouchableOpacity 
                  style={[styles.inputSearch, {height: 40}]}
                  onPress={()=>{
                    this._onPressSearch()
                  }}
                />
              )}  
              
              {permission_geolocation 
                && <IconNavigator 
                  style={[{position: "absolute", right: "5%", bottom: "30%",}, modalDetailVisible ? {bottom: 450} : {}]}
                  onPress={()=>{
                    this.setState({followsUserLocation: !followsUserLocation})
                    
                  }}
                  //isFollow={followsUserLocation}
                />}
              
              {!isRent 
                && 
              <View style={styles.submit}>
                <ButtonThema 
                  style={styles.submitButton}
                  text={i18n.t('take_charger')}
                  onPress={()=>{ 
                    navigation.navigate("PaymentStation", {
                      type: "Scaner",
                    }) 
                  }}
                />
              </View>}
              
              {Platform.OS == "android" 
                &&
                <ModalListStation 
                    isVisible={modalListVisible} 
                    onClose={()=>{this.setState({modalListVisible: false})}}
                    navigation={navigation}
                />  
              }      
              {Platform.OS == "android" 
                &&
                <ModalSearch 
                    isVisible={modalSearchVisible} 
                    onClose={()=>{this.setState({modalSearchVisible: false})}}
                    navigation={navigation}
                />
              } 
              <ModalRentStart 
                isVisible={modalRentStart} 
                navigation={navigation} 
                onClose={()=>{
                  this.setState({modalRentStart: false, activeMarkerID: null, })
                  actions.setting.setStyleHiddenSearch(false)
                  actions.setting.setStyleHiddenHeader(false)
                }}
              />
              <ModalRentEnd 
                isVisible={modalRentEnd} 
                navigation={navigation} 
                onClose={()=>{
                  this.setState({modalRentEnd: false, activeMarkerID: null, })
                  actions.setting.setStyleHiddenSearch(false)
                  actions.setting.setStyleHiddenHeader(false)
                }}
              />
              <ModalDetailStation 
                  isVisible={modalDetailVisible} 
                  navigation={navigation} 
                  isRent={isRent}
                  onClose={()=>{
                    this.setState({modalDetailVisible: false, activeMarkerID: null, })
                    actions.setting.setStyleHiddenSearch(false)
                    actions.setting.setStyleHiddenHeader(false)
                  }}
                  item={detail}
              />
              <ActiveRent style={styles.activeRent}/> 
              {setting_style.overlay && <Overlay />}
        </SafeAreaView>
        
    )
  }
}



export default  connect(state => ({
    points: state.station.points, 
    bulavka: state.search.bulavka,
    pins: state.search.pins,
    active_marker: state.station.active_marker,
    detail: state.station.detail,
    setting_style: state.setting.style,
    geolocation: state.user.geolocation,
    permission_geolocation: state.user.permission_geolocation,
    socket_rent_start: state.socket.rent_start,
    socket_rent_end: state.socket.rent_end,
    isRent: state.rent.isRent,
    rent_loader: state.rent.loader
}),
(dispatch) => ({
  actions: {
    user: bindActionCreators(ActionsUser, dispatch),
    station: bindActionCreators(ActionsStation, dispatch),
    setting: bindActionCreators(ActionsSetting, dispatch)
  }
})
)(MapScreen);


const styles = StyleSheet.create({
  container: {
      flex: 1,
      top: 0, 
      bottom: 0
  },  

  mapContainer: {
    paddingTop: 0,
    top: 0,
    height: "125%"
  }, 
  inputSearch: {
    position: "absolute", 
    top: 105, 
    alignItems: "center", 
    left: "5%", 
    right: "5%", 
  },
  submit: {
    bottom: 40,
    position: "absolute",
    left: "5%", 
    right: "5%", 
  },
  submitButton: {
    height: 60
  },
  activeRent: {
    position: "absolute",
    bottom: 15,
    left: "3%", 
    right: "3%",
  }
})
