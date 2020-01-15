import React, { Component } from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import Colors from "../constants/Colors";
import CodeInput from './third-party/ConfirmationCodeInput';

const screenWidth = Dimensions.get('screen').width;

class PassCodeInput extends Component {
  constructor(props) {
    super(props);
  }

  onCodeFilled = (code) => {
    const { onFilled } = this.props;
    onFilled(code);
  };

  onCodeChange = (code) => {
    const { onChange } = this.props;
    onChange(code);
  };

  render() {
    const { value, isWrong } = this.props;

    return (
      <View style={styles.container}>
        <CodeInput
          textContentType="oneTimeCode"
          value={value}
          keyboardType="numeric"
          codeInputStyle={{ fontWeight: "normal", fontSize: screenWidth > 350 ? 60 : 50, paddingVertical: 0 }}
          className={'border-b'}
          codeLength={4}
          size={50}
          sizeHeight={screenWidth > 350 ? 90 : 70}
          caretHidden={true}
          activeColor={isWrong ? '#EA9996' : Colors.tintColor}
          inputPosition="full-width"
          onFulfill={this.onCodeFilled}
          onCodeChange={this.onCodeChange}
          cellBorderWidth={2}
          placeholder="0"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    flexGrow: 0,
    backgroundColor: '#F8F8F8',
    paddingTop: 0,
    paddingBottom: 30,
    paddingHorizontal: 30,
    height: screenWidth > 350 ? 110 : 110,
    borderRadius: 5,
  }
});

PassCodeInput.propTypes = {
  isWrong: PropTypes.bool,
  length: PropTypes.number,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFilled: PropTypes.func.isRequired,
};

PassCodeInput.defaultProps = {
  length: 4,
};

export default PassCodeInput;
