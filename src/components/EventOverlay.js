import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import Link from './Link';
import closeCrossSvg from '../media/close-cross.svg';
import './EventOverlay.css';
import ReactPlayer from 'react-player';
import getUserLocation from '../util/getUserLocation';
import LoadingButton from './LoadingButton.js';
import RelatedEvents from './RelatedEvents.js';
import Star from './icons/StarIcon';
import OverlayCloser, { setOverlayCloserPosition } from './OverlayCloser';

const handleNavigationClick = (destinationLat, destinationLng, callback) => {
  getUserLocation().then((location) => {
    callback({
      origin: {lat: location.lat, lng: location.lng},
      destination: {lat: destinationLat, lng: destinationLng}
    });
  });
};

class EventOverlayBackdrop extends Component {
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

const getLocation = (event) => {
  return event.location && event.location.streetAddress && event.location.postalCode
  ? `${event.location.streetAddress}, ${event.location.postalCode}` : null;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDateFormatted = (dateStr) => {
  const date = new Date(dateStr);
  return {
    month: monthNames[date.getMonth()],
    day: date.getDate(),
    time: `${date.getHours()}:${date.getMinutes() === 0 ? '00' : date.getMinutes()}`
  };
};

const CloseButton = ({handleClose}) => (
<div className='EventOverlay-closeButton-wrapper'>
  <button className='EventOverlay-closeButton' onClick={(ev) => { ev.stopPropagation(); handleClose(ev) }}>
    <img src={closeCrossSvg} alt="Close" />
  </button>
</div>
);

const EventDate = ({start, end}) => (
  <div>
    <span className='EventOverlay-dateGraphic'>
      {start.day}
      <br />
      <span className='EventOverlay-dateGraphic__month'>
        {start.month}
      </span>
    </span>
    <span className='EventOverlay-date'>
      {start.time}
    </span>
    { end.day > (start.day)
    ? <span className='EventOverlay-dateSeparator'>–</span>
    : <span className='EventOverlay-dateSeparator EventOverlay-dateSeparator--narrow'>-</span>
    }
    { end.day > (start.day) &&
    <span className='EventOverlay-dateGraphic'>
      {end.day}
      <br />
      <span className='EventOverlay-dateGraphic__month'>
        {end.month}
      </span>
    </span>
    }
    <span className='EventOverlay-date'>
      {end.time}
    </span>
  </div>
);

const EventOverlay = ({event, showVideoButton, onVideoButtonClick, handleShowDirections, translatables}) => {
  return (
  <div className='EventOverlay' onClick={ev => ev.stopPropagation()}>
    { event.imgUrl &&
    <div className='EventOverlay-imgWrapper'>
      <img className='EventOverlay-img' src={event.imgUrl} alt={ event.name } />
    </div>
    }
    <h2 className='EventOverlay-heading'>{ event.name }</h2>
      <div style={{width: '58%', marginRight: '5%', float: 'left'}}>
        {!!event.rating &&
           <h3 className='EventOverlay-ratingHeading'>{`Rating: ${event.rating}/5`}</h3>
        }
        <Scrollbars style={{ marginTop: '1rem', width: 'calc(100% + 1rem)' }} autoHeight autoHeightMax='100vh - 4.6875rem - 1.25rem - (550px)'>
          { event.content &&
          <div style={{height: '25rem'}}>
          <span className='EventOverlay-content-scrollWrapper'>
            <span
              className='EventOverlay-content'
              dangerouslySetInnerHTML={{ __html: event.content.replace(/\r\n/g, '<br />') }}
            />
          </span>
          </div>
          }
          { !!event.rating &&
            <div style={{height: '25rem'}}>
              <div className='EventOverlay-ratingWrapper'>
              {event.reviews && !!event.reviews.length &&
                event.reviews.map(review => (
                  <div>
                    <span className='EventOverlay-ratingName' key={review.author_name}>
                      {review.author_name}
                    </span>
                    <span className='EventOverlay-ratingStarWrapper'>
                      {
                        Array(review.rating).fill().map((_, index) => (
                          <Star key={index} color='#CB0050' strokeColor='#CB0050' strokeSize='3' className='EventOverlay-reviewStar EventOverlay-reviewStar--filled' />
                      ))}
                      {
                        Array(5 - review.rating).fill().map((_, index) => (
                          <Star key={index} color='#fff' strokeColor='#CB0050' strokeSize='3' className='EventOverlay-reviewStar EventOverlay-reviewStar--hollow' />
                      ))}

                    </span>
                    <p className='EventOverlay-ratingText'>{review.text}</p>

                  </div>
                ))
              }
              </div>
            </div>
          }
        </Scrollbars>
      </div>
    <div style={{width: '37%', float: 'right'}}>
    { (event.openingHours && !!event.openingHours.length) &&
    <div className='EventOverlay-metaBox'>
      <h3>{translatables.openingHours}</h3>
      { event.openingHours.map(date => <span key={date}>{date}<br /></span>)
      }
    </div>
    }
    { (event.occasions && !!event.occasions.length) &&
    <div className='EventOverlay-metaBox'>
      <h3>{translatables.dateAndTime}</h3>
      { event.occasions.map(occ => <EventDate
                                      start={getDateFormatted(occ.startDate)}
                                      end={getDateFormatted(occ.endDate)}
                                      key={Math.random()} />)
      }
    </div>
    }
    { getLocation(event) &&
    <div className='EventOverlay-metaBox'>
      <h3>{translatables.location}</h3>
      { getLocation(event) }
    </div>
    }
    { (event.contactEmail || event.contactPhone) &&
    <div className='EventOverlay-metaBox'>
      <h3>{translatables.contact}</h3>
      { event.contactEmail &&
      <div><a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a></div>
      }
      { (event.contactEmail && event.contactPhone) && <div style={{height: '0.5rem'}} /> }
      { event.contactPhone &&
      <div><a href={`tel:${event.contactPhone}`}>{event.contactPhone}</a></div>
      }
    </div>
    }
    {/*TODO: implement moreinformation links from back-end*/}
    { event.moreInformation &&
    <div className='EventOverlay-metaBox'>
      <h3>More information</h3>
      <ul>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
      </ul>
    </div>
    }
    <div className='EventOverlay-buttonWrapper'>
      { showVideoButton &&
      <button className='EventOverlay-videoButton' onClick={onVideoButtonClick}>
        Video
      </button>
      }
      { event.location && !!event.location.latitude && !!event.location.longitude &&
        <LoadingButton
          onClick={() =>
            handleNavigationClick(event.location.latitude, event.location.longitude, handleShowDirections)}
          cssClassName='EventOverlay-button'
          text={translatables.takeMeThere}
        />
      }
      { event.bookingLink &&
      <Link iframe={{url:event.bookingLink}} className='EventOverlay-button'>
        {translatables.tickets}
      </Link>
      }
    </div>
    </div>
  </div>
  );
};

EventOverlay.propTypes = {
  event: PropTypes.object, // todo
  handleShowDirections: PropTypes.func,
  translatables: PropTypes.shape({
    openingHours: PropTypes.string.isRequired,
    dateAndTime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    contact: PropTypes.string.isRequired,
    takeMeThere: PropTypes.string.isRequired,
    tickets: PropTypes.string.isRequired
  }).isRequired
};


const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables
  };
};

const EventOverlayConnected = connect(mapStateToProps, null)(EventOverlay);

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideo: false,
      videoUrl: props.event.youtubeUrl || props.event.vimeoUrl || null,
      comparedEvent: null,
      showConfirmClose: false
    };
  }

  handleCompareEvent(event) {
    this.setState({
      comparedEvent: event
    })
  }

  onBackDropClick(e) {
    this.setState({showConfirmClose: !this.state.showConfirmClose});
    const closeConfirmEl = this.refs.closeconfirm.wrappedInstance.refs.wrapper;
    setOverlayCloserPosition(e, closeConfirmEl);
  }

  static propTypes = {
    event: PropTypes.object,
    handleClose: PropTypes.func
  }

  render() {
    return (
      <EventOverlayBackdrop onClick={this.onBackDropClick.bind(this)}>
        <OverlayCloser ref='closeconfirm'
          onCloseModal={this.props.handleClose} isHidden={!this.state.showConfirmClose}
          onDismissClose={() => this.setState({showConfirmClose: false})}
        />
        { !this.state.showVideo
        ?
        <div className='EventOverlay-wrapper'>
          <div style={{position: 'absolute', top: '-2.5rem', right: '0'}}>
            <CloseButton handleClose={this.props.handleClose} />
          </div>
          <EventOverlayConnected
            event={this.props.event}
            handleClose={this.props.handleClose}
            handleShowDirections={this.props.handleShowDirections}
            onVideoButtonClick={this.handlePlayVideo.bind(this, true)}
            showVideoButton={this.state.videoUrl} />
            {this.state.comparedEvent &&
            <EventOverlayConnected
              event={this.state.comparedEvent}
              handleClose={this.props.handleClose}
              handleShowDirections={this.props.handleShowDirections}
              onVideoButtonClick={this.handlePlayVideo.bind(this, true)}
              showVideoButton={this.state.comparedEvent.youtubeUrl || this.state.comparedEvent.vimeoUrl || null} />
            }
          {this.props.relatedEvents && !!this.props.relatedEvents.length &&
            <RelatedEvents
              relatedEvents={this.props.relatedEvents}
              event={this.props.event}
              changeOverlayEvent={this.props.changeOverlayEvent}
              handleCompareEvent={this.handleCompareEvent.bind(this)}
              comparedEvent={this.state.comparedEvent}
              />}
        </div>
        :
        <div className='EventOverlay-videoWrapper'>
          <CloseButton handleClose={this.handlePlayVideo.bind(this, false)} />
          <ReactPlayer className='EventOverlay-video' url={this.state.videoUrl} playing />
        </div>
        }
      </EventOverlayBackdrop>
    );
  }

  handlePlayVideo(show) {
    this.setState({showVideo: show});
  }
}
