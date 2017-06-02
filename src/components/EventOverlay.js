import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import Link from './Link';
import classNames from 'classnames';
import closeCrossSvg from '../media/close-cross.svg';
import './EventOverlay.css';
import ReactPlayer from 'react-player';
import getUserLocation from '../util/getUserLocation';
import LoadingButton from './LoadingButton.js';
import RelatedEvents from './RelatedEvents.js';
import Star from './icons/StarIcon';
import OverlayCloser, { setOverlayCloserPosition } from './OverlayCloser';
import GoogleMapsDirections from './GoogleMapsDirections';

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

class EventOverlay extends Component {
  constructor(props){
    super(props);
    this.state = {
      directions: null
    };
  }
  componentDidMount() {
    console.log(this.props.showDirections);
    if(this.props.showDirections) {
      handleNavigationClick(this.props.event.location.latitude, this.props.event.location.longitude, this.handleShowDirections.bind(this))
    }
  }
  handleShowDirections(directions) {
    this.setState({directions: directions})
  }
  render() {
    return(
  <div className='EventOverlay' onClick={ev => ev.stopPropagation()}>
    { this.state.directions &&
      <GoogleMapsDirections
        origin={this.state.directions.origin}
        destination={this.state.directions.destination}
        handleClose={this.handleShowDirections.bind(this, null)}
        eventName={this.props.event.name}
        backToStartText={this.props.translatables.backToStart}
      />
    }
    { !this.state.directions &&
    <div>
    { this.props.event.imgUrl &&
    <div className='EventOverlay-imgWrapper'>
      <img className='EventOverlay-img' src={this.props.event.imgUrl} alt={ this.props.event.name } />
    </div>
    }
    <h2 className='EventOverlay-heading'>{ this.props.event.name }</h2>
      <div style={{width: '58%', marginRight: '5%', float: 'left'}}>
        {!!this.props.event.rating &&
           <h3 className='EventOverlay-ratingHeading'>{`Rating: ${this.props.event.rating}/5`}</h3>
        }
        <Scrollbars style={{ marginTop: '1rem', width: 'calc(100% + 1rem)' }} autoHeight autoHeightMax='100vh - 4.6875rem - 1.25rem - (550px)'>
          { this.props.event.content &&
          <div style={{height: '25rem'}}>
          <span className='EventOverlay-content-scrollWrapper'>
            <span
              className='EventOverlay-content'
              dangerouslySetInnerHTML={{ __html: this.props.event.content.replace(/\r\n/g, '<br />') }}
            />
          </span>
          </div>
          }
          { !!this.props.event.rating &&
            <div style={{height: '25rem'}}>
              <div className='EventOverlay-ratingWrapper'>
              {this.props.event.reviews && !!this.props.event.reviews.length &&
                this.props.event.reviews.map(review => (
                  <div key={review.author_name}>
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
    { (this.props.event.openingHours && !!this.props.event.openingHours.length) &&
    <div className='EventOverlay-metaBox'>
      <h3>{this.props.translatables.openingHours}</h3>
      { this.props.event.openingHours.map(date => <span key={date}>{date}<br /></span>)
      }
    </div>
    }
    { (this.props.event.occasions && !!this.props.event.occasions.length) &&
    <div className='EventOverlay-metaBox'>
      <h3>{this.props.translatables.dateAndTime}</h3>
      { this.props.event.occasions.map(occ => <EventDate
                                      start={getDateFormatted(occ.startDate)}
                                      end={getDateFormatted(occ.endDate)}
                                      key={Math.random()} />)
      }
    </div>
    }
    { getLocation(this.props.event) &&
    <div className='EventOverlay-metaBox'>
      <h3>{this.props.translatables.location}</h3>
      { getLocation(this.props.event) }
    </div>
    }
    { (this.props.event.contactEmail || this.props.event.contactPhone) &&
    <div className='EventOverlay-metaBox'>
      <h3>{this.props.translatables.contact}</h3>
      { this.props.event.contactEmail &&
      <div><a href={`mailto:${this.props.event.contactEmail}`}>{this.props.event.contactEmail}</a></div>
      }
      { (this.props.event.contactEmail && this.props.event.contactPhone) && <div style={{height: '0.5rem'}} /> }
      { event.contactPhone &&
      <div><a href={`tel:${this.props.event.contactPhone}`}>{this.props.event.contactPhone}</a></div>
      }
    </div>
    }
    {/*TODO: implement moreinformation links from back-end*/}
    { this.props.event.moreInformation &&
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
      { this.props.showVideoButton &&
      <button className='EventOverlay-videoButton' onClick={this.props.onVideoButtonClick}>
        Video
      </button>
      }
      { this.props.event.location && !!this.props.event.location.latitude && !!this.props.event.location.longitude &&
        <LoadingButton
          onClick={() =>
            handleNavigationClick(this.props.event.location.latitude, this.props.event.location.longitude, this.handleShowDirections.bind(this))}
          cssClassName='EventOverlay-button'
          text={this.props.translatables.takeMeThere}
        />
      }
      { this.props.event.bookingLink &&
      <Link iframe={{url:this.props.event.bookingLink}} className='EventOverlay-button'>
        {this.props.translatables.tickets}
      </Link>
      }
    </div>

    </div>
    </div>
    }
  </div>
  );
  }
}


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
    translatables: state.siteSettings.translatables[state.activeLanguage]
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
        <div className={classNames('EventOverlay-wrapper', {'EventOverlay-wrapper--compareView': this.props.relatedEvents && !!this.props.relatedEvents.length})}>
          <div style={{position: 'absolute', top: '-2.5rem', right: '0'}}>
            <CloseButton handleClose={this.props.handleClose} />
          </div>
          <EventOverlayConnected
            event={this.props.event}
            handleClose={this.props.handleClose}
            onVideoButtonClick={this.handlePlayVideo.bind(this, true)}
            showDirections={this.props.showDirections}
            showVideoButton={this.state.videoUrl} />
            {this.state.comparedEvent &&
            <EventOverlayConnected
              event={this.state.comparedEvent}
              handleClose={this.props.handleClose}
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
