/*! Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
	* Licensed Under MIT (http://opensource.org/licenses/MIT)
	*
	* React Ripple - Version 1.0.0
  *
  * Adopted from : https://github.com/nelsoncash/angular-ripple
	*
	*/

import PropTypes from 'prop-types';

import React from 'react';

import { Ripple } from './index.js';

import classNames from 'classnames';

class RippleButton extends React.Component {

  constructor() {
    super();
    this.state = {
      cursorPos: {}
    };
  }

  render() {
    return (
      <button
        ref='button'
        className={classNames(this.props.className, 'Ripple-parent')}
        onMouseUp={ this.handleClick.bind(this) }
        onClick={this.props.onClick}
      >
        { this.props.children }
        <Ripple cursorPos={ this.state.cursorPos } />
      </button>
    );
  }

  handleClick(e) {
    // Get Cursor Position
    let cursorPos = {
      top: e.clientY,
      left: e.clientX,
      time: Date.now()
    };
    this.setState({ cursorPos: cursorPos });
  }

}

RippleButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default RippleButton;