import * as actionTypes from '../actionTypes/onboarding';

interface Action {
  type: string
  payload: object
}

const initialState:
  {
    data: IOnboarding[],
    showOnboarding: boolean,
    isFetching: boolean
  } = {
    data: [],
    showOnboarding: true,
    isFetching: false,
  };

export default function (state = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.FETCH_ONBOARDING_SUCCESS:
      return { ...state, data: payload };
    case actionTypes.FETCH_ONBOARDING_REQUEST:
      return { ...state, ...payload, isFetching: true };
    case actionTypes.DISABLE_ONBOARDING:
      return { ...initialState, showOnboarding: false };
    default:
      return state;
  }
}