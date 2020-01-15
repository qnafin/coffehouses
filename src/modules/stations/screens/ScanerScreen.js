import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import QRScannerView from '../../../components/third-party/QRCodeScanner';
import qrCodeIcon from '../../../assets/images/icon/icon-qr-code.png';
import numbersIcon from '../../../assets/images/icon/icon-numbers.png';
import flashLightIcon from '../../../assets/images/icon/icon-flash-light.png';
import i18n from '../../../i18n';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsStation from '../../../actions/Station';
import * as ActionsRent from "../../../actions/Rent"
import Colors from '../../../constants/Colors'
import ThemaStyle from '../../../constants/ThemaStyle'
import TitlePageBack from '../../../components/TitlePageBack'
import {ScrollView} from 'react-native-gesture-handler';
import PassCodeInput from "../../../components/PassCodeInput";
import * as api from "../../../api";

const screenWidth = Dimensions.get('screen').width;

class ScanerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      isCodeWrong: false,
      isScan: true,
      isChecking: false,
      isTorchOn: false,
    };
    let {navigation} = this.props
    this.PAYMENT_TYPE = navigation.state.params.payment_type;
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null
    }
  };

  componentDidMount() {
    let {actions} = this.props
  }

  handleChangeCode = (code) => {
    this.setState({code, isCodeWrong: false});
  };

  handleShowScan = () => {
    this.setState({isScan: true});
  };

  handleShowManual = () => {
    this.setState({isScan: false});
  };

  handleToggleTorch = () => {
    this.setState((state) => {
      return {
        ...state,
        isTorchOn: !state.isTorchOn,
      }
    })
  };

  handleCheckCode = (code) => {
    let {navigation, actions} = this.props
    this.setState({isChecking: true, isCodeWrong: false});
    api.getStationQrCode({qr: code})
      .then(response => {
        this.setState({isChecking: false});
        if (response.success === true) {
          // TODO: Успешный ответ
          let station_id = response.payload.id
          console.log("QR", station_id);
          actions.station.deactiveStation();
          actions.rent.createRent(station_id, this.PAYMENT_TYPE);
          navigation.navigate("Map")
        } else {
          this.setState({isCodeWrong: true});
        }
      })
      .catch(() => {
        this.setState({isChecking: false});
      })
  };

  onScanSuccess = (e) => {
    const code = e.data;
    this.setState({code /*, isScan: false*/});
    this.handleCheckCode(code);
  };

  /* onTest = () => {
    const code = '2142';
    this.setState({code, isScan: false});
    this.handleCheckCode(code);
  }; */

  renderScanHeader = () => {
    let {navigation} = this.props
    return (
      <View style={styles.contentContainer}>
        <TitlePageBack
          name={i18n.t('come_back')}
          onPress={() => {
            navigation.goBack()
          }}
          openMenu={false}
          navigation={navigation}
          isInverted={true}
        />
        <Text style={[styles.title, { color: '#fff' }]}>Взять зарядное устройство</Text>
        <Text style={[styles.description, { color: '#fff' }]}>
          Отсканируйте QR код, он находится справа, внизу на терминале.
        </Text>
      </View>
    );
  };

  renderScanFooter = () => {
    const { isTorchOn } = this.state;

    return (
      <View style={styles.qrScanFooter}>
        <View style={styles.qrScanFooterItem}>
          <TouchableOpacity style={styles.qrScanFooterButton} onPress={this.handleShowManual}>
            <Image source={numbersIcon} />
          </TouchableOpacity>
          <Text style={styles.qrScanFooterButtonTitle}>
            Ввести код вручную
          </Text>
        </View>
        <View style={styles.qrScanFooterItem}>
          <TouchableOpacity style={[styles.qrScanFooterButton, isTorchOn ? styles.qrScanFooterButtonActive : {}]} onPress={this.handleToggleTorch}>
            <Image source={flashLightIcon} />
          </TouchableOpacity>
          <Text style={styles.qrScanFooterButtonTitle}>
            {isTorchOn ? 'Выключить фонарь' : 'Включить фонарь'}
          </Text>
        </View>
      </View>
    )
  };

  render() {
    let {navigation, faq} = this.props;
    const {code, isScan, isChecking, isCodeWrong, isTorchOn} = this.state;

    if (isScan) {
      return (
        <View style={{flex: 1}}>
          <QRScannerView
            onScanResult={this.onScanSuccess}
            onCancel={this.handleShowManual}
            torchOn={isTorchOn}
            renderHeaderView={this.renderScanHeader}
            renderFooterView={this.renderScanFooter}
            hintText={null}
            cornerStyle={{
              borderColor: Colors.tintColor,
              borderWidth: 3,
              width: 15,
              height: 15,
            }}
            rectStyle={{
              borderColor: "#000000",
              width: screenWidth > 350 ? 250 : 200,
              height: screenWidth > 350 ? 250 : 200,
              borderWidth: 0,
            }}
            isShowScanBar={false}
          />
        </View>
      );
    }

    return (
      <View style={[styles.container]}>
        <KeyboardAvoidingView style={styles.contentContainer} behavior={Platform.OS === "ios" ? "padding" : false} enabled>
          <TitlePageBack 
              name={i18n.t('come_back')}
              onPress={() => {
                navigation.goBack()
              }}
              openMenu={false}
              navigation={navigation}
          />
          <Text style={styles.title}>Взять зарядное устройство</Text>
          <Text style={styles.description}>
            Введите код, указанный на терминале
          </Text>
          <View style={styles.flexSpacer}/>
          <PassCodeInput
            value={code}
            isWrong={isCodeWrong}
            onChange={this.handleChangeCode}
            onFilled={this.handleCheckCode}
          />
          <View style={styles.checkState}>
            {isChecking && <ActivityIndicator size="large" color={Colors.tintColor}/>}
            {isCodeWrong && (
              <Text style={styles.codeWrong}>Введен неверный код, попробуйте еще раз</Text>
            )}
          </View>
          <View style={styles.flexSpacer}/>
          <TouchableOpacity style={styles.qrCodeButton} onPress={this.handleShowScan}>
            <Image
              source={qrCodeIcon}
              width={30}
              height={30}
              style={styles.qrCodeImage}
            />
            <Text>
              Или отсканируйте код
              {screenWidth > 350 ? ' на станции' : ''}
            </Text>
          </TouchableOpacity>
          <View style={styles.flexSpacer}/>
        </KeyboardAvoidingView>
      </View>
    )
  }
}


export default connect(state => ({
    //faq: state.main.faq,
  }),
  (dispatch) => ({
    actions: {
      station: bindActionCreators(ActionsStation, dispatch),
      rent: bindActionCreators(ActionsRent, dispatch)
    }
  })
)(ScanerScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  contentContainer: {
    paddingTop: ThemaStyle.paddingTopStatic,
    paddingLeft: "8%",
    paddingRight: "8%",
    paddingBottom: ThemaStyle.paddingTopStatic,
    flexGrow: 1
  },
  keyBoardContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "#124124"
  },
  flexSpacer: {
    flexGrow: 1,
    marginVertical: 5,
  },
  title: {
    fontSize: screenWidth > 350 ? 20 : 18,
    fontWeight: "bold",
  },
  description: {
    color: Colors.grey,
    fontSize: screenWidth > 350 ? 17 : 14,
    marginTop: screenWidth > 350 ? 20 : 10,
  },
  checkState: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  codeWrong: {
    color: "#EA9996",
    fontSize: 14,
  },
  qrCodeButton: {
    height: 60,
    display: "flex",
    flexDirection: "row",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    paddingHorizontal: 20,
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  qrCodeImage: {
    marginRight: 20,
  },
  qrScanFooter: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },
  qrScanFooterItem: {
    width: 100,
  },
  qrScanFooterButton: {
    width: 60,
    height: 60,
    marginHorizontal: 20,
    borderRadius: 60,
    backgroundColor: "#000000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  qrScanFooterButtonTitle: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  qrScanFooterButtonActive: {
    backgroundColor: "#FFFFFF05"
  }
});
