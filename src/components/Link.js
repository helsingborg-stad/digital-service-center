import React, { PropTypes } from 'react';
import { Ripple } from './react-ripple-effect';

class Link extends React.Component {
  constructor() {
    super();
    this.state = {
      cursorPos: {}
    };
  }

  render() {
    return (
      <a
        className={this.props.className}
        style={{position: 'relative', overflow: 'hidden'}}
        href={this.props.href}
        onMouseUp={ this.handleClick.bind(this) }
      >
        {this.props.children}
        <Ripple cursorPos={ this.state.cursorPos } />
      </a>
    );
  }

  handleClick(e) {
    const cursorPos = {
      top: e.clientY,
      left: e.clientX,
      time: Date.now()
    };
    this.setState({ cursorPos: cursorPos });
  }
}

Link.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export default Link;
