import React from 'react';
import ReactDOM from 'react-dom';

import AllExamples from './all-examples.jsx';

document.addEventListener('DOMContentLoaded', function(event) {
  ReactDOM.render(
    <AllExamples />,
    document.querySelector('#content-container')
  );
});
