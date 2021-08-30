import { Dimensions } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export const URL = 'http://back.lawapp.dev3.digital-spectr.ru/api/v1'

// Device Width
export const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);
export const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height);

export const PADDING_SIZE = 20

// margin top values
export const TITLE_TOP = '5%'
export const DESCRIPTION_TOP = '5%'
export const MARGIN_TOP_LG = '9%'
export const MARGIN_TOP_MD = '4%'
export const MARGIN_TOP_SM = '2.4%'

// Text
export const TEXT_SIZE_11 = 1.7
export const TEXT_SIZE_12 = 1.8
export const TEXT_SIZE_13 = 1.9
export const TEXT_SIZE_14 = 2.1
export const TEXT_SIZE_15 = 2.1
export const TEXT_SIZE_16 = 2.2
export const TITLE_SIZE = 4.5

// Colors
export const Colors = {
    background: '#FFFFFF',
    black: '#000000',
    blackLight: '#1C1C1C',
    blue: '#1D5ACB',
    blueLight: '#E8EFFA',
    grayLight: '#F8F8F8',
    gray: '#8A8A8F',
    grayDark: '#666666',
    grayDarkest: '#4D4D4D',
    red: '#FF3B30'
}

export const Fonts = {
    bold: 'Rubik-Bold',
    medium: 'Rubik-Medium',
    regular: 'Rubik-Regular',
}