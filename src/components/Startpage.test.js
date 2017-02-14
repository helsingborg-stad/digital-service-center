import React from 'react';
import ReactDOM from 'react-dom';
import Startpage from './Startpage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Startpage />, div);
});
