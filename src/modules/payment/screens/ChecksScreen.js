import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  View,
} from 'react-native';

import i18n from '../../../i18n';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsPayment from '../../../actions/Payment';
import HeaderMenu from "../../../components/HeaderMenu"
import IconMenu from '../../../components/IconMenu'
import Colors from '../../../constants/Colors'

import ThemaStyle from '../../../constants/ThemaStyle'
import TitlePageBack from '../../../components/TitlePageBack'
import Accordion from '../../../components/Accordion'
import { ScrollView } from 'react-native-gesture-handler';
import Link from '../../../components/Link';
import IconShare from "../../../components/IconShare"

class ChecksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
    let {navigation} = this.props
    this.RENT_ID = navigation.state.params.rent_id;
  }
  
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  };
  componentDidMount() {
    let {actions} = this.props
    if(this.RENT_ID) {
        actions.payment.getChecks(this.RENT_ID)
    }
    
  }
  _shareMessage() {
    let {checks} = this.props
    return checks.map((item, index) => `${i18n.t('check')} №${index+1} ${i18n.t('from')} ${item.date} ${i18n.t('on_sum')} ${item.sum} ${item.url}`)
             .join("\n")
  }
  render () {
    let {navigation, checks, payment} = this.props
    return (
      <View style={[styles.container]}>
        <View style={styles.contentContainer}>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <TitlePageBack name={i18n.t('checks')} 
                  onPress={()=>navigation.navigate('Map')} 
                  openMenu={true} 
                  navigation={navigation}
              />
              {checks.length > 0 && <IconShare message={this._shareMessage()}/>}
          </View>
          <FlatList
              //style={{ backgroundColor: "red", height: 200}}
              ItemSeparatorComponent={ () => <View style={ styles.separator } /> }
              data={checks}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                  <View style={styles.itemTariff}>
                      <Text style={styles.name} >{i18n.t('check')} №{index+1}</Text>
                      <Link style={styles.share} text={i18n.t('look')} url={item.url}/>
                  </View>
              )}
          /> 
        </View>
    </View>
    )
  }
}



export default  connect(state => ({
  checks: state.payment.checks,
  payment: state.payment 
}),
(dispatch) => ({
  actions: {
    payment: bindActionCreators(ActionsPayment, dispatch)
  }
})
)(ChecksScreen);


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#f8f8f8"
  },  
  contentContainer: {
    paddingTop: ThemaStyle.paddingTopStatic,
    paddingLeft: "8%",
    paddingRight: "8%",
    flexGrow: 1
  },
  separator: { 
    width: "100%", 
    height: 1, 
    backgroundColor: "#E2E2E2" 
  },
  itemTariff: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20
  },
  name: {
    fontSize: 14,
    color: Colors.black
  },
  share: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black
  }
})