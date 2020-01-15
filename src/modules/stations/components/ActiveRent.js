import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  DeviceEventEmitter,
  StyleSheet
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionsRent from '../../../actions/Rent'
import i18n from '../../../i18n'

import Colors from '../../../constants/Colors'
import L from '../../../constants/Layout'
import ThemaStyle from '../../../constants/ThemaStyle'
import h from '../../../api/helper'


class ActiveRent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      now_timestamp: this.now_timestamp()
    };
  }

  componentDidMount(){
    let {actions} = this.props
    actions.rent.getRent();
   
    this.interval = setInterval(
      () => {
        this.setState({now_timestamp: this.now_timestamp()})
      },
      1000
    );
    this.intervalStatus = setInterval(
      () => {
        actions.rent.getRent();
      },
      1000*60
    );
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.intervalStatus);
  }
  upTime(time_start:timestamp, time_now:timestamp) {
   return h.timerFormat(time_now - time_start)
  }
  trialTime(time_trial:timestamp, time_now:timestamp) {
    if(time_now - time_trial < 0) {
      return h.timerFormat( Math.abs(time_now - time_trial )).time
    } else {
      return null
    }
  }
  now_timestamp() {
    return Math.floor(Date.now() / 1000)
  }
  renderTiralTimer() {
    let {now_timestamp} = this.state
    let {rent} = this.props
    let {trial_time, start_rent} = rent.status

    let timer = this.trialTime(start_rent + trial_time, now_timestamp);
    if(timer) {
      return (
        
        <View style={styles.trialTimer}>
          <LinearGradient
            colors={Colors.greenGradient}
            style={[styles.buttonButton]}
          >
            <Text style={[styles.textWhite]}>
              {i18n.t("free_time")} 
              <Text style={styles.timerBlock}> {this.trialTime(start_rent + trial_time, now_timestamp)}</Text>
            </Text>
          </LinearGradient>
        </View>
      )
    }
    return null
  }
  renderTrial() {
    let {now_timestamp} = this.state
    let {rent, actions} = this.props
    
    let {tariff, trial_time, next_tariff, start_rent, time_end, description} = rent.status
    if(time_end <= now_timestamp) {
      actions.rent.getRent();
    }
    return (
      <View>
          {this.renderTiralTimer()}
          <Text style={styles.description}>{description}</Text>
          <View style={[styles.info]}>
            <View>
              <Text style={[styles.litleText]}>
                {i18n.t("time")}
              </Text>
              <Text style={[styles.normalText, styles.timerBlock]}>
                {this.upTime(start_rent , now_timestamp).time}
              </Text>
            </View>
            <View>
              <Text style={[styles.litleText]}>
                {tariff.description}
              </Text>
              <Text style={[styles.normalText, (tariff.price == 0) ? styles.green : styles.tariffText]}>
                {tariff.price_format}
              </Text>
            </View>
            <View>
              <Text style={[styles.normalText, (next_tariff.price == 0) ? styles.green : styles.tariffText]}>
                {next_tariff.price_format}
              </Text>
              <Text style={[styles.litleText]}>
                {next_tariff.description}
              </Text>
            </View>
        </View>
      </View>
      
    )
  }
  renderHour() {
    let {now_timestamp} = this.state
    let {rent, actions} = this.props
    
    let {tariff, trial_time, next_tariff, start_rent, time_end, description} = rent.status
    
    if(time_end <= now_timestamp) {
      actions.rent.getRent();
    }
    return (
      <View>
          <Text style={styles.description}>{description}</Text>
          <View style={[styles.info]}>
            <View>
              <Text  style={[styles.litleText]}>
                {tariff.description}
              </Text>
              <Text style={[styles.normalText, (tariff.price == 0) ? styles.green : styles.tariffText]}>
                {tariff.price_format}
              </Text>
            </View>
            <View>
              <Text style={[styles.litleText]}>
                {i18n.t("time_left")}
              </Text>
              <Text style={[styles.normalText, styles.timerBlock]}>
                {this.trialTime(time_end, now_timestamp) || "00:00:00" }
              </Text>
            </View>
            <View>
              <Text style={[styles.litleText]}>
                {next_tariff.description}
              </Text>
              <Text style={[styles.normalText, (next_tariff.price == 0) ? styles.green : styles.tariffText]}>
                {next_tariff.price_format}
              </Text>
            </View>
        </View>
      </View>
    )
  }
  renderDay() {
    let {now_timestamp} = this.state
    let {rent, actions} = this.props
    
    let {tariff, trial_time, next_tariff, start_rent, description, time_end} = rent.status
  
    if(time_end <= now_timestamp) {
      //actions.rent.getRent();
      actions.rent.rentStop();
    }
    let time = this.upTime(start_rent, now_timestamp)
    let day_text = time.day == 0 ? i18n.t("time") : time.day + " " + h.num2str(time.day, i18n.t('arr_day'))
    return (
      <View>
          <Text style={styles.description}>
            {description}
          </Text>
          <View style={[styles.info]}>
            <View>
              <Text style={[styles.litleText]}>
                {day_text}
              </Text>
              <Text style={[styles.normalText, styles.timerBlock]}>
                {time.time}
              </Text>
            </View>
            <View>
              <Text  style={[styles.litleText]}>
                {tariff.description}
              </Text>
              <Text style={[styles.normalText, (tariff.price == 0) ? styles.green : styles.tariffText ]}>
                {tariff.price_format}
              </Text>
            </View>
            <View>
              <Text style={[styles.normalText, (next_tariff.price == 0) ? styles.green : styles.tariffText]}>
                {next_tariff.price_format}
              </Text>
              <Text style={[styles.litleText, ]}>
                {next_tariff.description}
              </Text>
            </View>
        </View>
      </View>
    )
  }
  render() {

    let {style, rent} = this.props
    if(!rent.status) return null;

    let {description, type} = rent.status
    return (
      <View style={[styles.container, style]}>
       
          {type == "trial" && this.renderTrial()}
          {type == "hour" && this.renderHour()}
          {type == "day" && this.renderDay()}
          
      </View>
    )
  }
}

export default  connect(state => ({
  rent: state.rent
}),
(dispatch) => ({
  actions: {
    rent: bindActionCreators(ActionsRent, dispatch)
  }
})
)(ActiveRent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15
  },
  description: {
    fontSize: ThemaStyle.fontSize11,
    padding: '5%',
    color: Colors.black,
    textAlign: "center"
  },
  info: {
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "5%"
  },
  shadow: ThemaStyle.shadow,
  litleText: {
    fontSize: ThemaStyle.fontSize12,
    color: Colors.black
  },
  normalText: {
    fontSize: ThemaStyle.fontSize14,
    paddingTop: 2,
    paddingBottom: 2,
    color: Colors.black
  },
  green: {
    color: Colors.green,
    fontWeight: "bold"
  },
  textWhite: {
    color: "white"
  },
  tariffText: {
    color: "#979797"
  },
  
  timerBlock: {
    width: L.isSmallDevice ? 55 : 65,
  },
  trialTimer: {
    position: "absolute",
    top: -45,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonButton: {
    backgroundColor: "#6F4CFF",
    borderRadius: 36,
    height: 36,
    width: 230,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    color: "white",
    paddingRight: 20,
    paddingLeft: 20,
    alignItems: "center"
  }
})