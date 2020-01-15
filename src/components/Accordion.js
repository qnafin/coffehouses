//const _ = require('lodash');
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ThemaStyle from '../constants/ThemaStyle'
import Colors from '../constants/Colors';
import MarkdownText from "../components/MarkdownText"

class AccordionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      show: this.props.show
    };
  }
  render() {
      let {title, data} = this.props
      let {name} = data;
      let {show} = this.state
      
      return <View style={[]} >
                <TouchableOpacity 
                  onPress={()=> this.setState({show: show ? false : true})}
                  style={styles.title_block}
                >
                  <Text style={[styles.title, show ? styles.active : null]}>{title || name}</Text>
                  <View style={styles.icon_block}>
                    <View style={[styles.icon, styles.shadow]}>
                      <Icon name={show ? "ios-arrow-up" : "ios-arrow-down"} color={show ? Colors.theme : null } size={15} style={[]}/>
                    </View>
                  </View>
                </TouchableOpacity>
                {show && <MarkdownText style={[styles.text, {}]}>{data.text}</MarkdownText>}
            </View>
    }
}
export default  class Accordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: []
    };
  }
  componentDidMount() {
    this.setState({items: this._customData()})
  }
  componentDidUpdate(prevProps) {
    let {data} = this.props
    if(prevProps.data !== data) { 
      
      this.setState({items: this._customData()})
    }
  }
  _customData() {
    let {data} = this.props
    return data.map((item, index) => {

      item["show"] = index === 0 ? true : false;
      
      return item
    })
  }
  render () {
    let {style, data} = this.props
    let {items} = this.state
    return (
      <View style={[ {marginBottom: 20}, style]}>
        {items.map((item, index) => {
          let {title, show} = item
          return <AccordionItem 
                    title={title} 
                    data={item} 
                    key={index} 
                    show={show}
                  />
        })}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shadow: ThemaStyle.shadow,
  icon: {
    width: 26, 
    height: 26,
    backgroundColor: "white",
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    color: Colors.theme
  },
  icon_block: {
    width: "10%"
  },
  title_block: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignContent: "center", 
    alignItems: "center"
  },
  title: {
    fontSize: 17,
    paddingTop: 17, 
    paddingBottom: 17,
    width: "90%",
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    color: "#4D4D4D"
  },
  rondoButton: {
    width: 66,
    height: 40,
    borderRadius: 48,
    alignContent: "center",
    justifyContent: 'center',
    alignItems: "center",
  }
})