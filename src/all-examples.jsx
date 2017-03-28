import React from 'react';

import PresentationalTextField from './presentational-text-field.jsx';
import CompositionalMoneyTextField from './compositional-money-text-field.jsx';;

import RememberValueHigherOrderComponent from './higher-order-component-remember-value.jsx';
const RememberedTextField = RememberValueHigherOrderComponent(PresentationalTextField);
const RememberedMoneyTextField = RememberValueHigherOrderComponent(CompositionalMoneyTextField);

import ContainerTextField from './container-text-field.js';

export default class AllExamples extends React.Component {
  componentWillMount() {
    this.props.fetchServerData();
  }

  render() {
    return (
      <div>
        <fieldset>
          <legend>[Presentational Component] Text Field</legend>
          <PresentationalTextField onChange={() => console.log('Type ')} />
        </fieldset>

        <fieldset>
          <legend>[Compositional Component] Money Text Field</legend>
          <CompositionalMoneyTextField onChange={() => console.log('HOC $$$$')} />
        </fieldset>

        <fieldset>
          <legend>[Higher-order Component] Stateful Text Field</legend>
          <RememberedTextField />
        </fieldset>

        <fieldset>
          <legend>[Higher-order Component] Stateful Money Text Field</legend>
          <RememberedMoneyTextField />
        </fieldset>

        <fieldset>
          <legend>[Connected Component] Stateful Text Field</legend>
          <ContainerTextField />
        </fieldset>
      </div>
    );
  }
};
