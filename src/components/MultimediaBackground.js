import React, { Component } from 'react';
import './MultimediaBackground.css';

export default class MultimediaBackground extends Component {
  render() {
    return (
      <div className='MultimediaBackground'>
        { this.props.children }
      </div>
    );
  }
}

MultimediaBackground.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};