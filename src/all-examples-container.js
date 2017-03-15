import { connect } from 'react-redux';

import AllExamples from './all-examples.jsx';
import textFieldActions from './actions/text-field.js';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServerData: () => {
      fetch('server-api/text-field.json')
        .then((response) => response.json())
        .then((json) => JSON.parse(json))
        .then((data) => dispatch(textFieldActions.updateValue(data.value)));
    }
  };
};

const AllExamplesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllExamples);

export default AllExamplesContainer;
