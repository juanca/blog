import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import AllExamples from './all-examples.jsx';
import store from './store/singleton.js';

document.addEventListener('DOMContentLoaded', function(event) {
  ReactDOM.render(
    <Provider store={store}>
      <AllExamples />
    </Provider>,
    document.querySelector('#content-container')
  );
});
