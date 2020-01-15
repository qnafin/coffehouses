import React from 'react';
import {
    View,
  } from 'react-native';
import { Ionicons ,  FontAwesome} from '@expo/vector-icons';
import Colors from '../../../constants/Colors';

export default function IconChecked({style ,checked}) {
  return (
    <View style={style}>
        {checked 
            ? <Ionicons name="ios-checkmark-circle" size={34} color="white" />
            : <FontAwesome name="circle-thin" size={32} color="white" />
        }
    </View>
  );
}
