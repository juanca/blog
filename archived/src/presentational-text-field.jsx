import React from 'react';

export default function PresentationalTextField (props) {
  return (
    <div>
      <label>{props.labelText}</label>
      {props.prefix}
      <input onChange={props.onChange} value={props.value} />
      {props.postfix}
    </div>
  );
}

PresentationalTextField.propTypes = {
  labelText: React.PropTypes.string,
  onChange: React.PropTypes.func,
  postfix: React.PropTypes.element,
  prefix: React.PropTypes.element,
  value: React.PropTypes.string,
}

PresentationalTextField.defaultProps = {
  labelText: 'Text Field',
  // onChange: , // No default value to allow `undefined`
  // postfix: , // No default value to allow `undefined`
  // prefix: , // No default value to allow `undefined`
  // value: , // No default value to allow `undefined`
}
