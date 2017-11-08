import React, { Component } from 'react';

export default class EventOverlayBackdrop extends Component {
  render() {
    return <div {...this.props} className='EventOverlayBackdrop'>{this.props.children}</div>
  }
}

EventOverlayBackdrop.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};
