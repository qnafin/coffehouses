import React from 'react';
import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  StatusBar,
  View,
} from 'react-native';
import i18n from '../../../i18n';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../../actions/index';
import Colors from '../../../constants/Colors'

import ThemaStyle from '../../../constants/ThemaStyle'
import TitlePageBack from '../../../components/TitlePageBack'
import { ScrollView } from 'react-native-gesture-handler';

import MarkdownText from "../../../components/MarkdownText"

class AcceptAPayScreen extends React.Component {
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
    actions.getMain()
  }
  componentDidUpdate(prevProps) {
    
  }
  render () {
    let {navigation, apay} = this.props
    
    return (
      <View style={[styles.container]}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <TitlePageBack 
                name={i18n.t('accept_apple_pay')} 
                navigation={navigation}
            />
            <MarkdownText>{apay.text}</MarkdownText>
        </ScrollView>
    </View>
    )
  }
}



export default  connect(state => ({
  apay: state.main.apay, 
}),
(dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
})
)(AcceptAPayScreen);


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
})