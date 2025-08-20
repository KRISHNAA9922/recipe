// src/components/HeaderCurve.tsx

import React from 'react';
import { useTheme } from 'tamagui';
import Svg, { Path } from 'react-native-svg';

export function HeaderCurve() {
  const theme = useTheme();
  const backgroundColor = theme.background.val;

  return (
    <Svg
      height="50"
      width="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: -1 }}
    >
      <Path
        d="M0,0 C30,100 70,100 100,0 L100,100 L0,100 Z"
        fill={backgroundColor}
      />
    </Svg>
  );
}
