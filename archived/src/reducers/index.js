import { combineReducers } from 'redux';

import textFieldReducer from './text-field.js';

export default combineReducers({
  textField: textFieldReducer,
});
