import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class EventOverlayBackdrop extends Component {
  render() {
    return <div {...this.props} className='EventOverlayBackdrop'>{this.props.children}</div>
  }
}

EventOverlayBackdrop.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};