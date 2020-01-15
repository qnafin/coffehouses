import React from 'react';
import {
  Image,
  TouchableOpacity,
  Share,
  Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors'
import config from '../../../app.json'

import i18n from '../../i18n';

export default function IconShare({style, title, message, color = Colors.black}) {
  onShare = async () => {
    try {

      const result = await Share.share({
        message: message
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <TouchableOpacity onPress={this.onShare} style={style} >
        <Icon name={Platform.OS == "ios" ? "md-share" : "md-share"} size={32} color={color} />
    </TouchableOpacity>
  );
}
