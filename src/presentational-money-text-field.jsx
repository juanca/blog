import React from 'react';

export default function PresentationalMoneyTextField (props) {
  return (
    <div>
      <label>{props.labelText}</label>
      <div>$$$</div>
      <input onChange={props.onChange} value={props.value} />
      <div>clear</div>
    </div>
  );
}

PresentationalMoneyTextField.propTypes = {
  labelText: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
};

PresentationalMoneyTextField.defaultProps = {
  labelText: 'Money Field',
};
