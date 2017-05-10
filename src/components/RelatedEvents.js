import React from 'react';
import './RelatedEvents.css';
import { Event } from './EventShowcase';
import Scrollbars from 'react-custom-scrollbars';

const getRelatedEventsByCategory = (relatedEvents, categoryId, comparedEvent) => {
  return relatedEvents.filter(event => {
    return (!comparedEvent || event.id !== comparedEvent.id) && event.categories.find(c => c.id === categoryId);
  });
};

export default class RelatedEvents extends React.Component {
  constructor({event}) {
    super();
    this.state = {
      event: event
    }
  }
  static propTypes = {
    relatedEvents: React.PropTypes.array,
    event: React.PropTypes.object,
    comparedEvent: React.PropTypes.object,
    changeOverlayEvent: React.PropTypes.func,
    handleCompareEvent: React.PropTypes.func

  }
  render() {
    return (
      <div className='RelatedEvents'>
        <h3>Relaterade events</h3>
        <div className='RelatedEvents-wrapper'>
          <Scrollbars
            style={{height: '50rem'}}
            renderTrackHorizontal={props => <div {...props} className='track-horizontal' style={{display: 'none'}}/>}
            renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' style={{display: 'none'}}/>}>
          <div style={{margin: '1rem 1.5rem 1rem 0'}}>
          {this.state.event.categories.map(cat => (
              <span key={cat.id}>
                {!!getRelatedEventsByCategory(this.props.relatedEvents, cat.id, this.props.comparedEvent).length &&
                <div>
                <span className='RelatedEvents-heading'>{cat.name}</span>
                <div className='RelatedEvents-eventWrapper'>
                <Scrollbars style={{width: '100%', height: '100%'}}>
                  {getRelatedEventsByCategory(this.props.relatedEvents, cat.id, this.props.comparedEvent).map(event => (
                    <Event
                      key={event.id}
                      {...event}
                      onClick={this.props.changeOverlayEvent}
                      handleCompareEvent={this.props.handleCompareEvent}
                      canCompare={true} />
                  ))}
                </Scrollbars>
                </div>
                 </div>
                }
              </span>

          ))}
          </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}