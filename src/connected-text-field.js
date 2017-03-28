import { connect } from 'react-redux';

import TextField from './presentational-text-field.jsx';
import actions from './actions/text-field.js';

const mapStateToProps = (state) => {
  return {
    value: state.textField.value,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (event) => {
      dispatch(actions.updateValue(event.target.value));
    }
  };
};

const ConnectedTextField = connect(
  mapStateToProps,
  mapDispatchToProps
)(TextField);

export default ConnectedTextField;
