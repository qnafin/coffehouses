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
import * as ActionsSearch from '../../../actions/Search';
import * as ActionsSetting from '../../../actions/Setting';

import i18n from '../../../i18n';

import ModalContainer from "../../../components/ModalContainer"
import InputSearch from "../components/InputSearch"

import Icon from 'react-native-vector-icons/Ionicons';
import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors'

import ButtonThema from "../../../components/ButtonThema"
import h from "../../../api/helper"

import ModalScreenContainer from "../../../components/ModalScreenContainer";
import ListAddress from "../components/ListAddress"


class SearchScreen extends React.Component {
    //Используется только в IOS, Android использует ModalSearch
    constructor(props) {
      super(props);
      this.state = { 
        address: null
      };
    }
    _onChangeText(text) {
        this.setState({address: text})
        let {actions} = this.props
        
        actions.search.getAddress({address: text, lat: null, lon: null})
    }
    componentWillUnmount() {
        let {actions} = this.props
    
        actions.setting.setStyleHiddenHeader(false)
        actions.setting.setStyleHiddenSearch(false)
    }
    componentDidUpdate(prevProps, prevState) {
        let {isVisible} = this.props
        
        if(prevProps.isVisible !== isVisible) { 
            if(isVisible === false) {
                let {actions} = this.props
                //actions.search.clear()
            }
        }
         
    }
    render() {
        let {addresses, navigation, actions} = this.props
        let {address} = this.state
        
        return (
            <ModalScreenContainer>
                <View style={{flex: 1, width: "100%", paddingRight: "5%", paddingLeft: "5%"}}>
                    <InputSearch 
                        placeholder={i18n.t('search_by_street_or_metro')}
                        onFocus={()=>{}}
                        onPress={()=>{}}
                        autoFocus={true}
                        onChangeText={text => this._onChangeText(text)}
                        style={styles.borderInput}
                    />
                    <View style={styles.addressBlockList}>
                        <ListAddress data={addresses} navigation={navigation} actions={actions}/>
                    </View>
                </View>
                
            </ModalScreenContainer>        
        )
    }
}

export default  connect(state => ({
    addresses: state.search.addresses
  }),
  (dispatch) => ({
    actions: {
        search: bindActionCreators(ActionsSearch, dispatch),
        setting: bindActionCreators(ActionsSetting, dispatch)
    }
  })
  )(SearchScreen);

const styles = StyleSheet.create({
   
    borderInput: {
        borderWidth: 1, 
        borderRadius: 50,
        
        borderColor: Colors.green,
        marginTop: 20,
        paddingLeft: 0
    },
    addressBlockList: {
        padding: 10,
        width: "100%",
        height: Layout.window.height * 0.75
    }
})