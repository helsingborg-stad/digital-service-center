import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import Link from '../Link';
import classNames from 'classnames';
import closeCrossSvg from '../../media/close-cross.svg';
import './EventOverlay.css';
import ReactPlayer from 'react-player';
import getUserLocation from '../../util/getUserLocation';
import LoadingButton from '../LoadingButton.js';
import RelatedEvents from '../RelatedEvents.js';
import OverlayCloser, { setOverlayCloserPosition } from '../OverlayCloser';
import GoogleMapsDirections from '../GoogleMapsDirections';

import EventOverlayBackdrop from './components/EventOverlayBackdrop'
import EventOverlayReviews from './components/EventOverlayReviews';
import EventOverlayRelatedInformation from './components/EventOverlayRelatedInformation';

const handleNavigationClick = (destinationLat, destinationLng, callback) => {
  getUserLocation().then((location) => {
    callback({
      origin: {lat: location.lat, lng: location.lng},
      destination: {lat: destinationLat, lng: destinationLng}
    });
  });
};

const CloseButton = ({handleClose}) => (
<div className='EventOverlay-closeButton-wrapper'>
  <button className='EventOverlay-closeButton' onClick={(ev) => { ev.stopPropagation(); handleClose(ev) }}>
    <img src={closeCrossSvg} alt="Close" />
  </button>
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
        showInformationText={this.props.translatables.showInformation}
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
        <Scrollbars style={{ marginTop: '1rem', width: 'calc(100% + 1rem)' }} autoHeight autoHeightMax='80vh - 4.6875rem - 1.25rem - (550px)'>
          { this.props.event.content &&
          <div>
          <span className='EventOverlay-content-scrollWrapper'>
            <span
              className='EventOverlay-content'
              dangerouslySetInnerHTML={{ __html: this.props.event.content.replace(/\r\n/g, '<br />') }}
            />
          </span>
          </div>
          }
          { !!this.props.event.rating &&
            <EventOverlayReviews reviews={this.props.event.reviews} />
          }
        </Scrollbars>
      </div>
    <div style={{width: '37%', float: 'right'}}>

      <EventOverlayRelatedInformation event={this.props.event} translatables={this.props.translatables} />

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
