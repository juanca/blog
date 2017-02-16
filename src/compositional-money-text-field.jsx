import React from 'react';

import TextField from './presentational-text-field.jsx';

export default function CompositionalMoneyTextField (props) {
  return (
    <TextField {...props}
      prefix={<div>$</div>}
      postfix={<div>clear</div>}
    />
  );
}
