const initialState = {
  value: 'asdf',
};

function updateValue(state, value) {
  if (state.value === value) {
    return state;
  }

  return Object.assign({}, state, { value });
}

export default function textFieldReducer(state = initialState, action) {
  switch(action.type) {
    case 'UPDATE_TEXT_FIELD': return updateValue(state, action.payload);
    default: return state;
  }
};
