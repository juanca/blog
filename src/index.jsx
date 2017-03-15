import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import AllExamplesContainer from './all-examples-container.js';
import store from './store/singleton.js';

document.addEventListener('DOMContentLoaded', function(event) {
  ReactDOM.render(
    <Provider store={store}>
      <AllExamplesContainer />
    </Provider>,
    document.querySelector('#content-container')
  );
});
