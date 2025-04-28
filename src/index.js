import React from 'react';
import ReactDOM from 'react-dom/client';
// import Bootstrap CSS and Bootstrap Bundle JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
