import * as actionTypes from '../actionTypes/auth';
import * as Navigation from 'navigation';
import Api from 'api';
import { errorHandler, cutPhone } from 'utils';
import { DrawerActions, StackActions } from '@react-navigation/native';
import { getApplications } from './personalArea'

export const sendSms = (phone: string, resending=false, navigation) => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.PHONE_VERIFICATION_REQUEST })

    const cuttedPhone = cutPhone(phone)

    Api.Auth.sendSms(cuttedPhone)
      .then(res => {
        if (res.data.success) {
          dispatch({ type: actionTypes.PHONE_VERIFICATION_SUCCESS })
          if (!resending) {
            navigation.push('CodeInput', { phoneNumber: phone })
          }
        }
      })
      .catch(err => {
        errorHandler(err)
        dispatch({ type: actionTypes.PHONE_VERIFICATION_ERROR })
      })
  };
}

export const setCode = (code: string) => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.SET_CODE, payload: code })
  };
}

export const setPhone = (phone: string) => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.SET_PHONE, payload: phone })
  };
}

export const setToken = (token) => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.SIGN_IN_SUCCESS, payload: token });
  }
}

export const signIn = ({ phone, code, navigation, navigateTo }: { phone: string, code: string, navigation: any, navigateTo?: string }) => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.SIGN_IN_REQUEST })
    Api.Auth.signIn(phone, code)
      .then(res => {
        dispatch({ type: actionTypes.SIGN_IN_SUCCESS, payload: res.data.data });
        
        setTimeout(() => {
          dispatch(getApplications())
        }, 1000);
        
        if (navigateTo) {
          navigation.push(navigateTo)
        } else {
          navigation.dispatch(StackActions.popToTop());
          const jumpToAction = DrawerActions.jumpTo('Services');
          navigation.dispatch(jumpToAction)
        }
      })
      .catch(err => {
        // console.log(err.response)
        // errorHandler(err)
        dispatch({ type: actionTypes.SIGN_IN_ERROR })
      })
  };
}

export const resetCode = () => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.CLEAR_CODE })
  };
}


export const logout = () => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.LOGOUT })
  };
}