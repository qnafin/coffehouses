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

import Colors from '../../../constants/Colors'

import ThemaStyle from '../../../constants/ThemaStyle'
import IconNavigator from "../components/IconNavigator"
import MarkerList from "../components/MarkerList"
import CustomLocationMarker from "../components/CustomLocationMarker"
import InputSearch from "../components/InputSearch"
import ButtonThema from "../../../components/ButtonThema"
import ModalDetailStation from "../components/ModalDetailStation"
import ModalListStation from "../components/ModalListStation"
import ModalSearch from "../components/ModalSearch"
import Overlay from "../../../components/Overlay"
import ZoomButtons from "../components/ZoomButtons"

const stylesMap = require("../stylesMap.json")
const IS_ANDROID = Platform.OS == "android";



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
    this.zoom = 16;
  }

  componentDidMount() {
    let {actions, permission_geolocation} = this.props;
    let {initialRegion} = this.state
    
   
    actions.station.getPoints(this.currentRegion)

    this.intervalGetPoints = setInterval(
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
    clearInterval(this.intervalGetPoints);
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
      permission_geolocation, 
      actions, 
    } = this.props

    if(prevState.followsUserLocation !== followsUserLocation) { 
     
      if(followsUserLocation) {
        //включена слежка за пользователем 
        this._getCurrentPosition()
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

      //this.setState({followsUserLocation: false}) //раскоментировать, если хотим остановить приследование
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

  }
  _onRegionChanged(region) {
    this.currentRegion = region

    this.map.getCamera().then((camera) => {
      this.zoom = camera.zoom
    })
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
 
  // _onPressSearch() {
  //   let {actions, navigation} = this.props
    
  //   if(Platform.OS == "ios") {
  //     navigation.navigate('Search')
  //   } else {
  //     this.setState({modalSearchVisible: true})
  //   }
   
  //   actions.setting.setStyleHiddenHeader(true)
  //   actions.setting.setStyleHiddenSearch(true)
  // }
  _onChangeZoom(num) {
      if(num > 0 && this.zoom < 20) {
        this.zoom += num
        this.animateToRegion(this.currentRegion, this.zoom)
      } 
      else if (num < 0 && this.zoom > 0) {
        this.zoom += num
        this.animateToRegion(this.currentRegion, this.zoom)
      }
  }
  render () {
    let {
        navigation, 
        points, 
        detail, 
        setting_style, 
        actions, 
        permission_geolocation, 
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
    
    return (
        <SafeAreaView style={styles.container}>
          
          <CustomLocationMarker />
          <MapView
            ref={el => (this.map = el)}
            provider={ IS_ANDROID ? PROVIDER_GOOGLE : PROVIDER_GOOGLE}
            style={[styles.mapContainer]}
            //customMapStyle={stylesMap}
            showsUserLocation={true}
            //showsMyLocationButton={true}
            zoomEnabled={true}
            enableZoomControl={true}
            onRegionChange={(region) => this._onRegionChanged(region)}
            initialRegion={this.currentRegion}
            onPress={(e)=>console.log('press')}
            onPanDrag={(e)=>this._onPanDrag(e)}
            onUserLocationChange={(event) => {
              this._onUserLocationChanged(event)
            }}
            onMoveShouldSetResponder={()=>this.setState({followsUserLocation: false})}
           >
            
            {points.length > 0 && (
                 <MarkerList 
                    data={points} 
                    activeMarkerID={activeMarkerID}
                    onPress={({latitude, longitude, idStation}) => {
                      actions.station.goToStation({latitude, longitude, idStation, timeout: 0})
                    }} 
                  />
            )}

          </MapView>
          
            
          <View  style={{position: "absolute",  right: "5%", bottom: "48%",}} >
            <ZoomButtons 
              onPlus={()=>this._onChangeZoom(+1)}
              onMinus={()=>this._onChangeZoom(-1)}
            />   
              {permission_geolocation 
                && <IconNavigator 
                      style={{marginTop: 25}}
                      onPress={()=>{
                        this.setState({followsUserLocation: !followsUserLocation})
                      }}
                      isFollow={followsUserLocation}
              />}     
          </View>
              
               {/* {showSearch && (
                <InputSearch 
                  style={styles.inputSearch}
                  placeholder={i18n.t('search_by_street_or_metro')}
                  disabled={true}
                  onPress={()=>{}}
                />
              )} */}
              {/* {showSearch && (
                <TouchableOpacity 
                  style={[styles.inputSearch, {height: 40}]}
                  onPress={()=>{
                    this._onPressSearch()
                  }}
                />
              )}  */}
              {/*Platform.OS == "android" 
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
                />*/}
              {setting_style.overlay && <Overlay />}
        </SafeAreaView>
        
    )
  }
}



export default  connect(state => ({
    points: state.station.points, 
    active_marker: state.station.active_marker,
    detail: state.station.detail,
    setting_style: state.setting.style,
    geolocation: state.user.geolocation,
    permission_geolocation: state.user.permission_geolocation,
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
    top: -30,
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
