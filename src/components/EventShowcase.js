import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { Ripple } from './react-ripple-effect';
import './EventShowcase.css';
import Moment from 'moment';
import cn from 'classnames';

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

class Event extends Component {
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
        className={cn('Event', {'Event--compare': this.props.canCompare})}
        style={{position: 'relative', overflow: 'hidden', cursor: 'pointer'}}
        onClick={() => this.props.onClick(this.props.slug)}
        onMouseUp={ this.handleClick.bind(this) }
      >
        <img className='Event-img' src={this.props.imgUrl} alt='' />
        <span className='Event-title'>
          {!this.props.canCompare && this.props.occasions && !!this.props.occasions.length &&
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
        {this.props.canCompare &&
        <div className='Event-compareWrapper'>
          {this.props.canCompare && this.props.occasions && !!this.props.occasions.length &&
              <span className='Event-date Event-date--compare'>
                {Moment(this.props.occasions.reduce((closestDate, occ) => {
                  if (!closestDate.occasions || closestDate.startDate >= occ.startDate) {
                    return occ;
                  }
                  return closestDate;
                }).startDate).format('YYYY-MM-DD')}
              </span>
          }
          <button className='Event-compare' onClick={(e) => {
            e.stopPropagation();
            this.props.handleCompareEvent(this.props);
          }}>{this.props.translatables.compare}</button>
        </div>
        }
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
  occasions: PropTypes.array,
  canCompare: PropTypes.bool,
  handleCompareEvent: PropTypes.func,
  translatables: PropTypes.shape({
    compare: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables
  };
};

const EventConnected = connect(mapStateToProps, null)(Event);

export {
   EventConnected as Event
};
