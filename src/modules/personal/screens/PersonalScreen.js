import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import i18n from '../../../i18n';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsUser from '../../../actions/User';
import Colors from '../../../constants/Colors'
import ThemaStyle from '../../../constants/ThemaStyle'

import TitlePageBack from '../../../components/TitlePageBack'
import { ScrollView } from 'react-native-gesture-handler';

import ButtonThema from "../../../components/ButtonThema"

class PersonalScreen extends React.Component {
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
    actions.user.getUser()
  }
  componentDidUpdate(prevProps) {
    
  }
  _logOut() {
    let {actions, navigation} = this.props
    Alert.alert(
       i18n.t('attention'),
       i18n.t('do_you_really_want_to_sign_out'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {text: i18n.t('yes'), onPress: () => {
          actions.user.logOut()
          navigation.navigate("AuthPhone")
        }},
      ],
      {cancelable: false},
    );
    
  }
  render () {
    let {navigation, user, actions} = this.props

    return (
      <View style={[styles.container]}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <TitlePageBack name={i18n.t('profile') + ` #${user.id}`} 
                onPress={()=>navigation.navigate('Map')} 
                openMenu={true} 
                navigation={navigation}
            />
            <Text style={styles.city}>{"г. Москва"}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity onPress={()=>this._logOut()}>
            <Text style={styles.exit}>{i18n.t('logout')}</Text>
          </TouchableOpacity>
        </View>
    </View>
    )
  }
}



export default  connect(state => ({
  user: state.user, 
}),
(dispatch) => ({
  actions: {
    user:  bindActionCreators(ActionsUser, dispatch)
  }
})
)(PersonalScreen);


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
  contactBottons: {
    flexDirection: "row",
    paddingTop: 50,
    justifyContent: "space-between"
  },
  city: {
    fontSize: 14,
    color: Colors.grey,
    paddingBottom: 10
  },
  phone: {
    fontSize: 17
  },
  footer: {
    paddingLeft: "8%",
    paddingRight: "8%",
    paddingBottom: 30
  },
  exit: {
    fontSize: 14, 
    color: Colors.green
  }
})