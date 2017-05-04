import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Ripple } from './react-ripple-effect';
import './EventShowcase.css';

export class EventShowcase extends Component {
  render() {
    return (
      <div className='EventShowcase'>
        <Scrollbars style={{ width: '100%', height: '100%' }}>
        {this.props.children}
        </Scrollbars>
      </div>
    );
  }
}

EventShowcase.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export class Event extends Component {
  constructor() {
    super();
    this.state = {
      cursorPos: {}
    };
  }

  render() {
    return (
      <span
        role='button'
        className='Event'
        style={{position: 'relative', overflow: 'hidden', cursor: 'pointer'}}
        onClick={() => this.props.onClick(this.props.slug)}
        onMouseUp={ this.handleClick.bind(this) }
      >
        <img className='Event-img' src={this.props.imgUrl} alt='' />
        <span className='Event-title'>{this.props.name}</span>
        <Ripple cursorPos={ this.state.cursorPos } />
      </span>
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

Event.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  id: React.PropTypes.any,
  slug: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  imgUrl: React.PropTypes.string
};
