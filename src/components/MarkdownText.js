import React from 'react';
import {
  Platform,
  StyleSheet,
} from 'react-native';

import Colors from '../constants/Colors'
import Markdown from 'react-native-markdown-renderer';

export default function MarkdownText({children, style}) {
  
  return (
    <Markdown style={{...styles, ...style}}>{children}</Markdown>
  );
}

const styles = StyleSheet.create({
 
  heading: {
    color: Colors.grey,
    textTransform: "uppercase"
  },
  heading1: {
    fontSize: 18,
  },
  heading2: {
    fontSize: 16,
  },
  heading3: {
    fontSize: 12,
  },
  heading4: {
    fontSize: 10,
  },
  heading5: {
    fontSize: 9,
  },
  heading6: {
    fontSize: 8,
  },
  text: {
    color: Colors.black,
    fontSize: 14,
    lineHeight: 23,
  }
});