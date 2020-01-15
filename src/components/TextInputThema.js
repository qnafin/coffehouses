import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text'

import Colors from '../constants/Colors'

export default class TextInputThema extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      text: null
    };
  }
  _onChangeText(text) {
    let {onChangeText} = this.props
    this.setState({text: onChangeText(text)})
  }
  render() {
    let {text} = this.state
    let {
      type, 
      options, 
      autoFocus, 
      masked, 
      keyboardType, 
      placeholder,
      maxLength,
      error,
      value,
      errorLabel,
      label
    } = this.props

    return (
      <View style={{flexDirection: "column"}}>
        {masked 
         ? <TextInputMask
              style={[ styles.inputText, error ? styles.errorText : null ]}
              type={type}
              options={options ? options : {}}
              selectionColor={Colors.salate}
              autoFocus={autoFocus ? autoFocus : false}
              underlineColorAndroid="transparent"
              autoCompleteType={"off"}
              autoCorrect={false}
              keyboardType={keyboardType ? keyboardType : "default"}
              value={text || value}
              placeholderTextColor={"#ccc"}
              maxLength={maxLength ? maxLength : null}
              onChangeText={text => this._onChangeText(text)}
              placeholder={placeholder}
          />
         : <TextInput
              style={[ styles.inputText, error ? styles.errorText : null ]}
              selectionColor={Colors.salate}
              autoFocus={autoFocus ? autoFocus : false}
              autoCompleteType={"off"}
              underlineColorAndroid="transparent"
              keyboardType={keyboardType ? keyboardType : "default"}
              value={text || value}
              autoCorrect={false}
              placeholderTextColor={"#ccc"}
              maxLength={maxLength ? maxLength : null}
              onChangeText={text => this._onChangeText(text)}
              placeholder={placeholder}
            />
        }
        {label && (
          <View style={[styles.label]}>
            <Text style={[styles.labelText, error ? styles.errorText : null]}>
              {error 
                ? errorLabel 
                : label }
            </Text>
          </View>
        )}
      </View>
      
    )
  }
}


const styles = StyleSheet.create({
    inputText: {
      fontSize: 18,
      borderColor: 'gray',
      borderWidth: 0,
      borderRadius: 16,
      width: "100%",
      paddingTop: 5,
      paddingBottom: 5,
      marginTop: 20,
      color: "#000000",
    },
    label: {
      paddingTop: 5,
      borderTopWidth: 0.5,
      borderTopColor: Colors.black
    },
    labelText: {
      fontSize: 12,
      color: Colors.black,
    },
    errorText: {
      color: "#EA9996"
    }
  })