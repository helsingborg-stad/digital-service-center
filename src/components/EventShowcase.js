import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Ripple } from './react-ripple-effect';
import './EventShowcase.css';
import Moment from 'moment';

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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
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
        onClick={() => this.props.onClick(this.props)}
        onMouseUp={ this.handleClick.bind(this) }
      >
        <img className='Event-img' src={this.props.imgThumbnailUrl} alt='' />
        <span className='Event-title'>
          { this.props.occasions && !!this.props.occasions.length &&
            <span className='Event-date'>
              {Moment(this.props.occasions.reduce((closestDate, occ) => {
                if (!closestDate.occasions || closestDate.startDate >= occ.startDate) {
                  return occ;
                }
                return closestDate;
              }).startDate).format('YYYY-MM-DD')}
            </span>
          }
          {this.props.name}
        </span>
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
  onClick: PropTypes.func.isRequired,
  id: PropTypes.any,
  slug: PropTypes.string,
  name: PropTypes.string.isRequired,
  imgUrl: PropTypes.string,
  imgThumbnailUrl: PropTypes.string,
  occasions: PropTypes.array
};
