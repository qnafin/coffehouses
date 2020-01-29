import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import i18n from '../../../i18n';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsUser from '../../../actions/User';
import * as ActionsPayment from '../../../actions/Payment';
import Colors from '../../../constants/Colors'
import ThemaStyle from '../../../constants/ThemaStyle'

import h from "../../../api/helper";
import TitlePageBack from '../../../components/TitlePageBack'
import { ScrollView } from 'react-native-gesture-handler';

import ButtonWhite from "../../../components/ButtonWhite";
import ButtonThema from "../../../components/ButtonThema";
import ItemCreditCard from "../components/ItemCreditCard";


const IS_ANDROID = Platform.OS == "android";


class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
    
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  };
  componentDidMount() {
    let {actions} = this.props
    actions.payment.getCards()
  }
 
  render () {
    let {navigation, rent, actions, payment} = this.props
    
    return (
      <View style={[styles.container]}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <TitlePageBack name={i18n.t('payment')} 
                onPress={()=>navigation.navigate('Map')} 
                openMenu={true} 
                navigation={navigation}
            />
            <View style={styles.block}>
              {(payment.cards.length == 0) && 
                  <ButtonWhite 
                      onPress={()=>{
                        navigation.navigate("PaymentCreateCard")
                      }}
                      text={i18n.t('snap_card')}
                      shadow={true}
              />}
              {payment.cards.map((item, index) => {
                return <ItemCreditCard 
                          key={index}
                          source={item.image ? {uri: item.image }: null}
                          card_number={h.formarCreditCard(item.number)}
                          card_date={item.date}
                        />
              })}
              {(payment.cards.length > 0) && 
                <ButtonWhite 
                  onPress={()=>{
                    actions.payment.dropCard()
                  }}
                  text={i18n.t('delete')}
                  shadow={true}
                />
              }
            </View>
            
        </ScrollView>
           
        <View style={styles.footer}>
            <Text style={styles.exit}>
              {IS_ANDROID ? i18n.t('accept_google_pay') : i18n.t('accept_apple_pay')}
            </Text>
            <Image 
              source={require("../../../assets/images/icon/cards_logos.png")} 
              resizeMode={"contain"} 
              style={{width: 150, height: 40}}  
            />
        </View>
    </View>
    )
  }
}



export default  connect(state => ({
  user: state.user, 
  payment: state.payment
}),
(dispatch) => ({
  actions: {
    user:  bindActionCreators(ActionsUser, dispatch),
    payment: bindActionCreators(ActionsPayment, dispatch)
  }
})
)(PaymentScreen);


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
  block: {
    paddingTop: 20
  },
  footer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingLeft: "8%",
    paddingRight: "8%",
    paddingBottom: 30
  },
  
})