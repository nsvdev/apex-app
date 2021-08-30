import * as actionTypes from '../actionTypes/user';

interface Action {
  type: string
  payload: object
}

const initialState = {
  id: null,
  email: null,
  name: null,
  lastName: null,
  middleName: null,
  image: null,
  phone: null,
  isFetching: false,
};

export default function (state = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.FETCH_USER_SUCCESS:
      return { ...state, ...payload };
    case actionTypes.SET_USER:
      return { ...state, ...payload };
    // case actionTypes.SIGN_IN_REQUEST:
    //   return { ...state, ...payload, isFetching: true };
    // case actionTypes.SIGN_IN_SUCCESS:
    //   return { ...state, ...payload };
    // case actionTypes.SIGN_IN_ERROR:
    //   return { ...state, isFetching: false };
    // case actionTypes.SIGN_UP_SUCCESS:
    //   return { ...state, ...payload };
    // case actionTypes.LOGOUT:
    //   return { ...initialState };
    default:
      return state;
  }
}