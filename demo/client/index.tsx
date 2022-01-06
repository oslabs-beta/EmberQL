//thread of execution starts here
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
// render('Hi I am a string');
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
