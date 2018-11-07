import { Component } from 'react';
import PropTypes from 'prop-types';

import { siteSettings as siteSettingsDispatch } from '../actions/siteSettings';

export default class FetchSiteSettings extends Component {
  constructor(props) {
    super();
    const { siteSettings } = props.store.getState();
    const siteSettingsExists = !!siteSettings && Object.keys(siteSettings).length;
    this.state = {
      loading: !siteSettingsExists
    };
  }

  render() {
    return this.state.loading
      ? null
      : this.props.render();
  }

  componentDidMount() {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(res => {
        this.props.store.dispatch(siteSettingsDispatch(res));
        this.setState({ loading: false });
      });
  }

  static propTypes = {
    store: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
  };
}
