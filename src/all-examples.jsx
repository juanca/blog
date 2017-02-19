import React from 'react';

import PresentationalTextField from './presentational-text-field.jsx';
import PresentationalMoneyTextField from './presentational-money-text-field.jsx';
import CompositionalMoneyTextField from './compositional-money-text-field.jsx';;

import RememberValueHigherOrderComponent from './higher-order-component-remember-value.jsx';
const RememberedTextField = RememberValueHigherOrderComponent(PresentationalTextField);
const RememberedMoneyTextField = RememberValueHigherOrderComponent(CompositionalMoneyTextField);

export default function AllExamples () {
  return (
    <div>
      <fieldset>
        <legend>[Presentational] Text Field</legend>
        <PresentationalTextField onChange={() => console.log('Type ')} />
      </fieldset>

      <fieldset>
        <legend>[Copypasta] Money Text Field</legend>
        <PresentationalMoneyTextField onChange={() => console.log('Type $$$$ ')} />
      </fieldset>

      <fieldset>
        <legend>[Presentational Higher Order Component] Money Text Field</legend>
        <CompositionalMoneyTextField onChange={() => console.log('HOC $$$$')} />
      </fieldset>

      <fieldset>
        <legend>[Behavioral Higher Order Component] Stateful Text Field</legend>
        <RememberedTextField />
      </fieldset>

      <fieldset>
        <legend>[Behavioral Higher Order Component] Stateful Money Text Field</legend>
        <RememberedMoneyTextField />
      </fieldset>
    </div>
  );
}
