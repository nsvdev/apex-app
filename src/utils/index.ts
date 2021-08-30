import { Alert, Platform } from 'react-native';
import moment from 'moment'

export const checkEmail: (email: string) => true | false = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const checkIsEmptyString: (str: string) => true | false = (str) => {
  str = String(str)
  if (!str || str.length === 0 || !str.trim()) {
    return true
  } else {
    return false // OK
  }
}

export const errorHandler = (err: any, from?: 'signIn' | 'signUp' | 'resetPassword') => {
  let msg = err.response || err // ''
  // errors.map((itm: {field: string, message: string[]}) => {
  //   switch (from) {
  //     case 'signIn':
  //       if (itm.message[0] == 'The selected email is invalid.') {
  //         msg = 'Пользователь с таким email не найден'
  //       } if (itm.message[0] == 'Не авторизован') {
  //         msg = 'Неверный логин или пароль'
  //       }
  //       break;
  //     case 'signUp':
  //       if (itm.message[0] == 'The email has already been taken.') {
  //         msg = 'Пользователь с таким email уже существует'
  //       }
  //       break;
  //     case 'resetPassword':
  //       if (itm.message[0] == 'The selected email is invalid.') {
  //         msg = 'Пользователь с таким email не найден'
  //       }
  //       break;
    
  //     default:
  //       msg = typeof(itm.message) === 'string' ? itm.message : itm.message[0]
  //       break;
  //   }
  // })
  

  Alert.alert(
    `Возникла ошибка`, // ${response.status}
    JSON.stringify(msg),
    [
      {text: 'OK', onPress: null},
    ],
    {cancelable: false},
  );
}

export const cutPhone: (phone: string) => string = (phone) => {
  let cuttedPhone = phone.replace(/ /g, '').replace(/-/g, '')
  if (cuttedPhone.slice(0, 1) === '+') {
    cuttedPhone = cuttedPhone.slice(1)
  }

  return cuttedPhone
}

export const num2str = (n, text_forms=['этаж', 'этажа', 'этажей']) => {
  n = Math.abs(n) % 100; var n1 = n % 10;

  if (n > 4 && n < 20) { return text_forms[2]; }
  if (n1 > 1 && n1 < 5) { return text_forms[1]; }
  if (n1 == 1) { return text_forms[0]; }
  return text_forms[2];
}


export const isIos = Platform.OS === 'ios'



export const statusTime = (date) => {
  const fromNow = moment.utc(date, 'DD-MM-YYYY hh:mm').local().fromNow()
  // const fromNow = moment('04-08-2020 17:40', 'DD-MM-YYYY hh:mm').local().fromNow()

  if (fromNow.length > 20 && moment.utc(date, 'DD-MM-YYYY').format('DD-MM-YYYY') === moment().utc().format('DD-MM-YYYY')) {
    return 'только что'
  } else if (fromNow.length > 20) {
    return moment.utc(date, 'DD-MM-YYYY hh:mm').format('DD.MM.YYYY').toString()
  }

  return fromNow
}