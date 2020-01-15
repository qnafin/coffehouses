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


import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionsSearch from '../../../actions/Search'
import * as ActionsSetting from '../../../actions/Setting'

import i18n from '../../../i18n'

import ModalContainer from "../../../components/ModalContainer"
import InputSearch from "../components/InputSearch"

import Icon from 'react-native-vector-icons/Ionicons'
import Layout from '../../../constants/Layout'
import Colors from '../../../constants/Colors'

import ButtonThema from "../../../components/ButtonThema"
import h from "../../../api/helper"
import ListAddress from "./ListAddress"


class ModalSearch extends React.Component {
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
    componentDidMount() {
        
    }
    componentDidUpdate(prevProps, prevState) {
        let {isVisible} = this.props
        let {actions} = this.props
        if(prevProps.isVisible !== isVisible) { 
            if(isVisible === false) {
                actions.setting.setStyleHiddenHeader(false)
                actions.setting.setStyleHiddenSearch(false)
            } 
        }
         
    }
    render() {
        let {isVisible, onClose, addresses, navigation, actions} = this.props
       
        return (
            <ModalContainer 
                isVisible={isVisible} 
                onClose={() => onClose()}
                opacity={0.5}
            >
                    
                <InputSearch 
                    placeholder={i18n.t('search_by_street_or_metro')}
                    onFocus={()=>{
                        
                    }}
                    autoFocus={true}
                    onChangeText={text => this._onChangeText(text)}
                    style={styles.borderInput}
                />
                <View style={styles.addressBlockList}>
                    <ListAddress onClose={()=>onClose()} data={addresses} navigation={navigation} actions={actions}/>
                </View>
                    
                    
            </ModalContainer>
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
)(ModalSearch);


const styles = StyleSheet.create({
   
    borderInput: {
        borderWidth: 1, 
        borderRadius: 50,
        width: "100%",
        borderColor: Colors.green,
        marginTop: 20,
        paddingLeft: 0
    },
    addressBlockList: {
        padding: 10,
        width: "100%",
        height: Layout.window.height * 0.68
    }
})