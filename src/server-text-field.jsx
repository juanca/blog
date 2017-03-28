import React from 'react';
import { connect } from 'react-redux';
import ConnectedTextField from './connected-text-field.js'

function HigherOrderComponent(Component) {
  return class FetchOnMount extends React.Component {
    componentWillMount() {
      this.props.fetchServerData();
    }

    render() {
      return <Component {...this.props} />;
    }
  }
}

const FetchTextField = HigherOrderComponent(ConnectedTextField);

const mapStateToProps = () => {};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchServerData: () => {
      fetch('server-api/text-field.json')
        .then((response) => response.json())
        .then((json) => JSON.parse(json))
        .then((data) => dispatch(actions.updateValue(data.value)));
    }
  };
};

const ServerTextField = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedTextField);

export default ServerTextField;
