import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import store from './redux/app/store'; // Adjust the import path to where your store is defined
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <Router> {/* Wrap your App component with Router */}
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
