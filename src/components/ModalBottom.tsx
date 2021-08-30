import React, { useEffect } from 'react';
import { View, Dimensions, BackHandler, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { DatePicker } from 'components';
import StyledText from './StyledText';
import { MainButton } from './Buttons';
import { Colors, TEXT_SIZE_15, Fonts, TEXT_SIZE_13, TEXT_SIZE_12 } from '../constants';
import { WheelPicker } from "react-native-wheel-picker-android";
import { isIos } from 'utils';
import { useSafeArea } from 'react-native-safe-area-context';
import RNModal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  children?
  visible: boolean
  onSwipeOut: (event?) => void,
  type?: 'datePicker' | 'alert' | 'picker' | 'other',
  title?: string
  description?: string
  onDateChange?: (date) => void,
  date?: Date
  minimumDate?: Date
  maximumDate?: Date
  onButtonPress?: () => void
  pickerData?: string[] // picker
  onItemChange?: (item: number) => void // picker
  selectedItem?: number // picker
  height?: number
}

const ModalBottom = (props: Props) => {
  const insets = useSafeArea();

  return props.type === 'picker' ? (
    <RNModal
      testID={'modal'}
      isVisible={props.visible}
      onSwipeComplete={props.onSwipeOut}
      // swipeDirection={['down']}
      // scrollTo={this.handleScrollTo}
      scrollOffset={200}
      scrollOffsetMax={600} // content height - ScrollView height
      propagateSwipe={true}
      style={{ 
        justifyContent: 'flex-end',
        margin: 0,
      }}
    >
      {/* <ScrollView contentContainerStyle={{ flex: 1 }}> */}

      
      <View style={{
        height: '45%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
      }}>
        <View
          style={{
            paddingTop: isIos ? 20 : 40,
            paddingBottom: isIos ? 70 : 0,
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <StyledText centered color={`#8A8A8F`} style={{ alignSelf: 'center', position: 'absolute', top: 15 }} size={TEXT_SIZE_15}>
            {props.title}
          </StyledText>

          <WheelPicker
            selectedItem={props.selectedItem}
            data={props.pickerData}
            onItemSelected={props.onItemChange}
            selectedItemTextFontFamily={Fonts.regular}
            itemTextFontFamily={Fonts.regular}
            indicatorColor={Colors.gray}
            indicatorWidth={0.5}
            style={{ width: '100%', alignSelf: 'center', height: 200 }}
            itemTextSize={16}
          />
          <MainButton
            title={`ОK`}
            onPress={props.onButtonPress}
            style={{ position: 'absolute', bottom: 20 }}
            // textStyle={{ color: Colors.blue }}
          />
        </View>
      </View>
      {/* </ScrollView> */}
    </RNModal>
    )
    : props.type === 'datePicker' ? (
      <RNModal
        testID={'modal'}
        isVisible={props.visible}
        onSwipeComplete={props.onSwipeOut}
        // swipeDirection={['up']}
        // scrollTo={this.handleScrollTo}
        swipeDirection="down"
        scrollOffset={200}
        scrollOffsetMax={600} // content height - ScrollView height
        // propagateSwipe={true}
        style={{ 
          justifyContent: 'flex-end',
          margin: 0,
        }}
      >
        <View style={{
          height: '45%',
          backgroundColor: 'white',
          paddingHorizontal: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }}>
          <View
            style={{
              paddingTop: isIos ? 20 : 0, // 40
              paddingBottom: isIos ? 70 : 0,
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <StyledText centered color={`#8A8A8F`} style={{ alignSelf: 'center', position: 'absolute', top: 15 }} size={TEXT_SIZE_15}>
              {props.title}
            </StyledText>

            <DatePicker
              date={props.date}
              onDateChange={props.onDateChange}
              minimumDate={props.minimumDate || new Date('December 17, 1995 03:24:00')}
              maximumDate={props.maximumDate || null}
              style={{ height: Dimensions.get('screen').height / 4 }}
            />
            <MainButton
              title={`ОK`}
              onPress={props.onButtonPress}
              style={{ position: 'absolute', bottom: 20 }}
              // textStyle={{ color: Colors.blue }}
            />
          </View>
        </View>
        {/* </ScrollView> */}
      </RNModal>
    ) : props.type === 'alert' ? (
      <RNModal
        testID={'modal'}
        isVisible={props.visible}
        onSwipeComplete={props.onSwipeOut}
        // swipeDirection={['down']}
        // scrollTo={this.handleScrollTo}
        swipeDirection="down"
        scrollOffset={200}
        scrollOffsetMax={600} // content height - ScrollView height
        // propagateSwipe={true}
        style={{ 
          justifyContent: 'flex-end',
          margin: 0,
        }}
      >
        <View
          style={{
            height: '50%',
            backgroundColor: 'white',
            paddingHorizontal: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}>
            <View
              style={{
                paddingTop: isIos ? 0 : 20,
                paddingBottom: isIos ? 40 : 20,
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                paddingHorizontal: 15
              }}
            >
              <StyledText bold numberOfLines={2} centered size={TEXT_SIZE_15}>{props.title}</StyledText>
              <View style={{ height: 20 }} />
              <StyledText size={TEXT_SIZE_12} numberOfLines={null} centered>{props.description}</StyledText>
              <View style={{ height: 20 }} />
              <MainButton
                title={`Понятно`}
                onPress={() => {
                  props.onSwipeOut()
                  props.onButtonPress()
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: '#E2E2E2',
                  position: 'absolute',
                  bottom: 25
                }}
                textStyle={{ color: Colors.blue }}
              />
            </View>
        </View>
      </RNModal>
  ) : (
    <RNModal
        testID={'modal'}
        isVisible={props.visible}
        onSwipeComplete={props.onSwipeOut}
        // swipeDirection={['down']}
        // scrollTo={this.handleScrollTo}
        swipeDirection="down"
        scrollOffset={200}
        scrollOffsetMax={600} // content height - ScrollView height
        // propagateSwipe={true}
        style={{ 
          justifyContent: 'flex-end',
          margin: 0,
        }}
      >
        <View
          style={{
            height: props.height || '50%',
            backgroundColor: 'white',
            paddingHorizontal: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}>
            <View
              style={{
                paddingTop: isIos ? 0 : 20,
                paddingBottom: isIos ? 40 : 20,
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                paddingHorizontal: 15
              }}
            >
              <StyledText bold numberOfLines={2} centered size={TEXT_SIZE_15}> </StyledText>
              <StyledText bold numberOfLines={2} centered size={TEXT_SIZE_15}>{props.title}</StyledText>
              {props.description ? (
                <>
                  <View style={{ height: 20 }} />
                  <StyledText size={TEXT_SIZE_12} numberOfLines={null} centered>{props.description}</StyledText>
                  <View style={{ height: 20 }} />
                </>
              ) : null}
              
              
              
              {props.children}

            </View>
        </View>
      </RNModal>
  )
}

export default ModalBottom

const Lever = styled.View`
  background-color: rgba(203, 205, 204, 0.5);
  width: 36px;
  height: 4px;
  align-self: center;
  margin-top: 15px;
`

const ModalContainer = styled.View`
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 20px;
  padding-horizontal: 20px;
`