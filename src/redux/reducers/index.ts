import { combineReducers } from 'redux';

import user from './userReducer';
import onboarding from './onboradingReducer';
import auth from './authReducer';
import services from './servicesReducer';
import penalty from './penaltyReducer';
import personalArea from './personalArea';

const reducers = combineReducers({
   user,
   onboarding,
   auth,
   services,
   penalty,
   personalArea
});

export default reducers;