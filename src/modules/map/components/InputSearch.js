import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';
import ThemaStyle from '../../../constants/ThemaStyle';
import Colors from '../../../constants/Colors';
import {isSmallDevice} from "../../../constants/Layout"

class InputSearch extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
      };
    }
    componentDidMount() {
        let {autoFocus} = this.props

        if(autoFocus) {
            Platform.OS === "ios" ? this.ref.focus() : setTimeout(() => this.ref.focus(), 50)
        }
    }
    render() {
        let {style, placeholder, autoFocus, onFocus, onPress, onChangeText, disabled} = this.props
        return (
            <View style={[style]}>
                <View style={[styles.input]}>
                    <TextInput 
                        style={{height: 40, width: "90%", color: Colors.black, fontSize:  isSmallDevice ? 12 : 14}}
                        placeholder={placeholder}
                        onFocus={onFocus}
                        editable={disabled ? false : true}
                        ref={ref => this.ref = ref}
                        autoFocus={autoFocus ? true : false}
                        onChangeText={onChangeText}
                        placeholderTextColor={"#ccc"}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={()=> onPress ? onPress() : {}}>
                        <View style={styles.searchButton}>
                            <Icon name={"ios-search"} size={15} />
                        </View>
                    </TouchableOpacity>
                </View>    
            </View>
          
        )
    }
}

export default InputSearch;

const styles = StyleSheet.create({
    input: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: "white",
        padding: 10,
        height: 40,
        color: Colors.black,
        paddingLeft: 15,
        paddingRight: 10,
        borderRadius: 30,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "space-between"
    },
    searchButton: {
        backgroundColor: Colors.greyBackground,
        borderRadius: 20, 
        width: 26, 
        height: 26,  
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"    
    }
})