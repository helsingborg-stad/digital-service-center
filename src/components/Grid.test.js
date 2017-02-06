import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Column } from './Grid';

it('Container renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Container />, div);
});

it('Row renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Row />, div);
});

it('Column renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Column />, div);
});
