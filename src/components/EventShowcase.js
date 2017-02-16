import React, { Component } from 'react';
import PaperRipple from 'react-paper-ripple';
import { Scrollbars } from 'react-custom-scrollbars';
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
  render() {
    return (
      <PaperRipple tag='a' className='Event' href={this.props.href}>
        <img className='Event-img' src={this.props.imgSrc} alt='' />
        <span className='Event-title'>{this.props.name}</span>
      </PaperRipple>
    );
  }
}

Event.propTypes = {
  href: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  imgSrc: React.PropTypes.string
};
