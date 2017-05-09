import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { EventsPage } from './EventsPage';
import configureStore from '../store/configureStore';

it('renders without crashing', () => {
  const store = configureStore({});
  const div = document.createElement('div');
  ReactDOM.render(
  <Provider store={store}>
    <EventsPage
      activeLanguage='sv'
      fetchData={() => {}}
      hasErrored={false}
      isLoading={false}
    />
  </Provider>, div);
});

it('renders loading state without crashing', () => {
  const store = configureStore({});
  const div = document.createElement('div');
  ReactDOM.render(
  <Provider store={store}>
    <EventsPage
      activeLanguage='sv'
      fetchData={() => {}}
      hasErrored={false}
      isLoading={true}
    />
  </Provider>, div);
});

it('renders error state without crashing', () => {
  const store = configureStore({});
  const div = document.createElement('div');
  ReactDOM.render(
  <Provider store={store}>
    <EventsPage
      activeLanguage='sv'
      fetchData={() => {}}
      hasErrored={true}
      isLoading={false}
    />
  </Provider>, div);
});
