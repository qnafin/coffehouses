import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingLeft: "4%",
    paddingRight: "4%",
  },
  contentContainer: {
    alignContent: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
  },
  description: {
    fontSize: 16,
    color: "#4D4D4D",
    marginTop: 10,
  },
  inputText: {
    fontSize: 26,
    borderColor: 'gray',
    borderWidth: 0,
    borderRadius: 16,
    width: "100%",
    marginTop: 20,
    color: "#000000",
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  error_text: {
    color: "#EA9996",
    fontSize: 12
  },
  contentBlock: {
    paddingRight: 20,
    minHeight: 160,
  },
  number: {
    textAlign: "left",
    fontSize: 26,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }
})
