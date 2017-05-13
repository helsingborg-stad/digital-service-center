import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import './RelatedEvents.css';
import { Event } from './EventShowcase';
import Scrollbars from 'react-custom-scrollbars';

const getRelatedEventsByCategory = (relatedEvents, categoryId, comparedEvent) => {
  return relatedEvents.filter(event => {
    return (!comparedEvent || event.id !== comparedEvent.id) && event.categories.find(c => c.id === categoryId);
  });
};

export class RelatedEvents extends React.Component {
  constructor({event}) {
    super();
    this.state = {
      event: event
    }
  }
  static propTypes = {
    relatedEvents: PropTypes.array,
    event: PropTypes.object,
    comparedEvent: PropTypes.object,
    changeOverlayEvent: PropTypes.func,
    handleCompareEvent: PropTypes.func,
    translatables: PropTypes.shape({
      related: PropTypes.string.isRequired
    }).isRequired
  }
  render() {
    return (
      <div className='RelatedEvents' onClick={ev => ev.stopPropagation()}>
        <h3>{this.props.translatables.related}</h3>
        <div className='RelatedEvents-wrapper'>
          <Scrollbars
            style={{height: 'calc(100% - 5.8rem)'}}
            renderTrackHorizontal={props => <div {...props} className='track-horizontal' style={{display: 'none'}}/>}
            renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' style={{display: 'none'}}/>}>
          <div style={{margin: '1rem 0'}}>
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

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables
  };
};

export default connect(mapStateToProps, null)(RelatedEvents);
