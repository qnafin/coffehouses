import {
  StyleSheet,
} from 'react-native';
import ThemeStyle from "../../constants/ThemaStyle"
import Colors from '../../constants/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: "4%",
  },
  contentContainer: {
    alignContent: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  title: {
    fontSize: ThemeStyle.fontSize34,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.black
  },
  header: {
    paddingTop: "25%",
    justifyContent: "center", 
    alignItems: "center", 
    flexDirection: "column"
  },
  description: {
    fontSize: ThemeStyle.fontSize17,
    color: Colors.black,
    textAlign: "center",
    marginTop: 10,
    lineHeight: ThemeStyle.fontSize22,
  },
  inputBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    borderColor: '#ccc',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  inputText: {
    fontSize: ThemeStyle.fontSize17,
    textAlign: "center",
    width: "100%",    
    color: Colors.black
  },
  close: {
    position: "absolute", 
    right: 10, 
    bottom: 5
  },
  button: {
    backgroundColor: "#6F4CFF",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    color: "white",
    width: "100%",
    alignItems: "center"
  },
  button_text: {
    color: Colors.grey,
    fontSize: ThemeStyle.fontSize17,
    fontWeight: "bold",
  },
  error_text: {
    color: "#FB6569",
    fontSize:  ThemeStyle.fontSize12,
  },
  contentBlock: {
    paddingTop: 10,
  },
  number: {
    textAlign: "left",
    fontSize: 26,
  },
  footer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agreement_text: {
    fontSize: ThemeStyle.fontSize11,
    color: Colors.grey,
    textAlign: "center",
    paddingTop: 20,
    paddingHorizontal: "4%"
  },
  timer: {
    fontSize: ThemeStyle.fontSize17,
    fontWeight: "bold",
    color: "#ccc"
  }
})
