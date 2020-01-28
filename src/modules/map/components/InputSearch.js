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
        autoFocus: false
      };
    }
    componentDidMount() {
        let {autoFocus} = this.props
        this.setState({autoFocus})
        
    }
    componentDidUpdate(prevProps, prevState) {
        let {autoFocus} = this.props
    
        if(prevProps.autoFocus !== autoFocus) { 
            if(autoFocus) {
                Platform.OS === "ios" ? this.ref.focus() : setTimeout(() => this.ref.focus(), 50)
                this.setState({autoFocus})
            }
        }
      }
    render() {
        let {style, placeholder, onFocus, onPress, onChangeText, disabled} = this.props
        let {autoFocus} = this.state
        return (
            <View style={[style]}>
                <View style={[styles.inputBlock]}>
                    <TouchableOpacity style={styles.searchButton} onPress={()=> onPress ? onPress() : {}}>
                        <View style={styles.searchButton}>
                            <Icon name={"ios-search"} size={18} color={Colors.grey}/>
                        </View>
                    </TouchableOpacity>
                    <TextInput 
                        style={styles.input}
                        placeholder={placeholder}
                        onFocus={onFocus}
                        editable={disabled ? false : true}
                        ref={ref => this.ref = ref}
                        autoFocus={autoFocus}
                        onChangeText={onChangeText}
                        placeholderTextColor={Colors.grey}
                    />
                </View>    
            </View>
          
        )
    }
}

export default InputSearch;

const styles = StyleSheet.create({
    inputBlock: {
        backgroundColor: Colors.greyBackground,
        flexDirection: "row",
        width: "100%",
        padding: 10,
        paddingVertical: 5,
        height: 36,
        color: Colors.black,
        borderRadius: 10,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "flex-start"
    },
    searchButton: {
        width: 15, 
        height: 20,
        marginRight: 2,  
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"    
    },
    input: {
        height: 36, 
        width: "100%",
        color: Colors.grey, 
        fontSize: ThemaStyle.fontSize14
    }
})