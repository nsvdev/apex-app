import * as actionTypes from '../actionTypes/auth';

interface Action {
  type: string
  payload: object
}

const initialState = {
  codeSuccess: false,
  codeError: false,
  isFetching: false,
  phone: null,
  token: null
};

export default function (state = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.SET_PHONE:
      return { ...state, phone: payload, codeError: false };
    case actionTypes.SET_CODE:
      return { ...state, code: payload };
    case actionTypes.PHONE_VERIFICATION_REQUEST:
      return { ...state, isFetching: true, codeError: false };
    case actionTypes.PHONE_VERIFICATION_SUCCESS:
      return { ...state, ...payload, isFetching: false, codeError: false };
    case actionTypes.SIGN_IN_REQUEST:
      return { ...state, ...payload, isFetching: true };
    case actionTypes.SIGN_IN_SUCCESS:
      return { ...state, token: payload, isFetching: false };
    case actionTypes.SIGN_IN_ERROR:
      return { ...state, codeError: true, isFetching: false };
    case actionTypes.CLEAR_CODE:
      return { ...state, codeError: false, isFetching: false };
    case actionTypes.LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}