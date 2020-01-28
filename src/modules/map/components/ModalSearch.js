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
import * as ActionsSearch from '../../../actions/Search'

import i18n from '../../../i18n';
import ModalContainer from "../../../components/ModalContainer"


import L from '../../../constants/Layout';
import Colors from '../../../constants/Colors'

import ButtonThema from "../../../components/ButtonThema"
import h from "../../../api/helper"
import ListStation from "./ListCoffeHouses"

import InputSearch from "./InputSearch"
import SwipeablePanel from "../../../components/swipeable_panel";
import ListAddress from "./ListAddress"

class ModalSearch extends React.Component {

    constructor(props) {
      super(props);
      this.state = { 
        text: null,
        swipeablePanelActive: false,
        openLarge: false
      };
      
    }
    componentDidMount() {
      let {geolocation, actions} = this.props
      let {text} = this.state
      this._openPanel();

      actions.search.getAddress({address: "", lat: null, lon: null})
    }
    componentWillUnmount() {
  
    }
    _onChangeText(text) {
      this.setState({address: text})
      let {actions} = this.props
      
      actions.search.getAddress({address: text, lat: null, lon: null})
    }
    _openPanel = () => {
      this.setState({ swipeablePanelActive: true });
    }
    _openLarge = () => {
      this.setState({ openLarge: true });
    }
    _closePanel = () => {
      this.setState({ swipeablePanelActive: false, openLarge: false });
    }
    _onLarge = () => {
      this.setState({ openLarge: true });
    }
    _onLargeClose = () => {
      this.setState({ openLarge: false});
    }
    _onCancel = () => {
      let {actions} = this.props
      this._closePanel()
      actions.search.clear()
      this.setState({text: null})
    }
    render() {
        let { stations, navigation, permission_geolocation, addresses, actions} = this.props
        let { swipeablePanelActive, openLarge } = this.state 
        return (
          <SwipeablePanel
            fullWidth
            isActive={swipeablePanelActive}
            onClose={this._closePanel}
            openPanel={this._openPanel}
            onPressCloseButton={this._closePanel}
            style={{borderRadius: 10}}
            noBackgroundOpacity={true}
            closeOnTouchOutside={true}
            allowFullClose={false}
            heightClose={75}
            heightSmall={180}
            modalFullHeight={false}
            noBar={!openLarge}
            onlyLarge={openLarge}
            openLarge={openLarge}
            onLarge={this._onLarge}
            onLargeClose={this._onLargeClose}
          >
            <View style={styles.content}>
                <View style={styles.searchBlock}>
                  <InputSearch 
                      placeholder={i18n.t('search_by_coffehouses')}
                      onFocus={()=>{
                          
                      }}
                      autoFocus={openLarge}
                      onChangeText={text => this._onChangeText(text)}
                      style={[openLarge ? styles.searchBlockClose : {width: "100%"}]}
                  />
                  {openLarge && 
                    <TouchableOpacity 
                      onPress={this._onCancel} 
                    >
                      <Text style={styles.closeButton}>{i18n.t("cancel")}</Text>
                    </TouchableOpacity>
                  }
                </View>
                {!openLarge && 
                  <TouchableOpacity 
                    style={[styles.inputSearch, {height: 40}]}
                    onPress={()=>{
                      this._openPanel()
                      this._openLarge()
                    }}
                  />
                }
                <View style={styles.addressBlockList}>
                  <ListAddress onClose={()=> {}} data={addresses} navigation={navigation} actions={actions}/>
                </View>
            </View>
          </SwipeablePanel>
        )
    }
}


export default  connect(state => ({
  addresses: state.search.addresses,
  permission_geolocation: state.user.permission_geolocation
}),
(dispatch) => ({
  actions: {
    search: bindActionCreators(ActionsSearch, dispatch)
  }
})
)(ModalSearch);



const styles = StyleSheet.create({
  inputSearch: {
    position: "absolute", 
    top: 16, 
    alignItems: "center", 
    left: "4%", 
    right: "4%", 
    opacity: 0.5
  },
  content: {
    paddingHorizontal: "4%", 
    paddingVertical: 16
  },
  searchBlock: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 12
  },
  searchBlockClose: {
    width: L.window.width - 100,
  },
  closeButton: {
    width: 60,
    textAlign: "center",
    color: Colors.grey
  }
})