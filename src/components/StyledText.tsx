import React from 'react';
import styled from 'styled-components/native';
import { Fonts, TEXT_SIZE_15, TITLE_SIZE, TEXT_SIZE_13 } from '../constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { isIos } from 'utils';

interface Props {
  size
  color
  opacity
  bold: boolean
  lineHeight: number
  isTitle: true
  centered?: boolean
}

// 13px
// 34px - title

const textSize = RFPercentage(TEXT_SIZE_13)
const titleSize = RFPercentage(TITLE_SIZE )

const StyledText: any = styled.Text`
  font-size: ${(props: Props) => props.size ? `${RFPercentage(props.size)}px` : ( props.isTitle ? `${titleSize}px` : `${textSize}px`)};
  color: ${(props: Props) => props.color || '#000000'};
  opacity: ${(props: Props) => props.opacity || 1};
  font-family: ${(props: Props) => props.bold ? Fonts.medium : Fonts.regular};
  font-weight: ${(props: Props) => props.bold ? '500' : 'normal'};
  /* line-height: ${(props: Props) => props.lineHeight || props.isTitle ? '35px' : '20px'}; */
  line-height: ${(props: Props) => props.lineHeight ? `${RFPercentage(props.lineHeight)}px` : props.isTitle
    ? `${titleSize + RFPercentage(0.5)}px`
    : props.size ? `${RFPercentage(props.size) + RFPercentage(0.8)}px` : `${textSize + RFPercentage(1)}px`};
  letter-spacing: 0.1px;
  text-align: ${(props: Props) => props.centered ? 'center': 'left'};
  /* height: ${(props: Props) => props.size ? `${RFPercentage(props.size * 1.2)}px` : ( props.isTitle ? `${titleSize * 1.2}px` : `${textSize * 1.2}px`)}; */
  /* border: 1px solid red; */
`;

export default StyledText;