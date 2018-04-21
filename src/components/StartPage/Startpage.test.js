import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Startpage } from './Startpage';
import configureStore from '../store/configureStore';
import initialStateForTests from '../store/initialStateForTests';

const store = configureStore(initialStateForTests);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Startpage
        activeLanguage='sv'
        fetchData={() => {}}
        fetchEventsData={() => {}}
        hasErrored={false}
        isLoading={false}
      />
    </Provider>, div);
});

it('renders loading state without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Startpage
        activeLanguage='sv'
        fetchData={() => {}}
        fetchEventsData={() => {}}
        hasErrored={false}
        isLoading={true}
      />
    </Provider>, div);
});

it('renders error state without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Startpage
        activeLanguage='sv'
        fetchData={() => {}}
        fetchEventsData={() => {}}
        hasErrored={true}
        isLoading={false}
      />
    </Provider>, div);
});
