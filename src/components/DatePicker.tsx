import React from 'react';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';
import 'moment/locale/es'



interface Props {
  onDateChange: (date) => void
  date: Date
  minimumDate?: Date
  maximumDate?: Date
  style?: object
}

const DatePickerComponent = (props: Props) => (
  <DatePicker
    style={{ backgroundColor: 'white', ...props.style }}
    locale={'ru'}
    minimumDate={props.minimumDate || new Date('December 17, 1795 03:24:00')}
    maximumDate={props.maximumDate || null}
    date={props.date}
    mode="date"
    minuteInterval={15}
    onDateChange={props.onDateChange}
  />  
)

export default DatePickerComponent;