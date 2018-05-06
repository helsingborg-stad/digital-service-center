import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import Link from '../Link';
import closeCrossSvg from '../../media/close-cross.svg';
import './EventOverlay.css';
import ReactPlayer from 'react-player';
import getUserLocation from '../../util/getUserLocation';
import LoadingButton from '../LoadingButton.js';
import GoogleMapsDirections from '../GoogleMapsDirections';
import { translateData } from '../../actions/translate';

import EventOverlayReviews from './components/EventOverlayReviews';
import EventOverlayRelatedInformation from './components/EventOverlayRelatedInformation';

import Overlay from '../OverlayBackdrop';

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
    <button className='EventOverlay-closeButton' onClick={(ev) => {
      ev.stopPropagation(); handleClose(ev);
    }}>
      <img src={closeCrossSvg} alt="Close" />
    </button>
  </div>
);

class EventOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      showTranslatedContent: false
    };
  }
  componentDidMount() {
    if (this.props.showDirections) {
      const { latitude, longitude } = this.props.event.location;
      handleNavigationClick(latitude, longitude, this.handleShowDirections.bind(this));
    }
    this.props.translateText(this.props.event.content, this.props.event.id, 'sv', 'en');
  }
  handleShowDirections(directions) {
    this.setState({directions: directions});
  }
  handleTranslateOnClick = () => {
    this.setState({showTranslatedContent: !this.state.showTranslatedContent});
  }
  render() {
    const content = this.state.showTranslatedContent && this.props.translatedContent ? this.props.translatedContent : this.props.event.content;
    return (
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
                dangerouslySetInnerHTML={{ __html: content.replace(/\r\n/g, '<br />')}}
              />
            </span>
          </div>
          }
          { !!this.props.event.rating &&
            <EventOverlayReviews reviews={this.props.event.reviews} />
          }
        </Scrollbars>
        {
          <div>
            <button className='EventOverlay-button' onClick={() => this.handleTranslateOnClick()}>
              {!this.state.showTranslatedContent ? 'Translate' : 'Original'}
            </button>
            <span style={{fontSize: 12, fontStyle: 'italic' }}>By Google Translate</span>
          </div>
        }
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
        <Link iframe={{url: this.props.event.bookingLink}} className='EventOverlay-button'>
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
  event: PropTypes.object,
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


const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.event.id;
  const translatedContent = (eventId in state.translation) && ('content' in state.translation[eventId])
    ? state.translation[eventId].content : null;
  const translationLoading = (eventId in state.translation)
    ? state.translation[eventId].loading : false;
  return {
    translatables: state.siteSettings.translatables[state.activeLanguage],
    activeLanguage: state.activeLanguage,
    translatedContent,
    translationLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    translateText: (text, id, source, target, lang) => dispatch(translateData(text, id, source, target, lang))
  };
};

const EventOverlayConnected = connect(mapStateToProps, mapDispatchToProps)(EventOverlay);

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideo: false,
      videoUrl: props.event.youtubeUrl || props.event.vimeoUrl || null
    };
  }

  static propTypes = {
    event: PropTypes.object,
    handleClose: PropTypes.func
  }

  render() {
    return (
      <Overlay handleClose={this.props.handleClose}>
        { !this.state.showVideo
          ?
          <div className='EventOverlay-wrapper'>
            <div style={{position: 'absolute', top: '-2.5rem', right: '0'}}>
              <CloseButton handleClose={this.props.handleClose} />
            </div>
            <EventOverlayConnected
              event={this.props.event}
              handleClose={this.props.handleClose}
              onVideoButtonClick={this.handlePlayVideo.bind(this, true)}
              showDirections={this.props.showDirections}
              showVideoButton={this.state.videoUrl} />
          </div>
          :
          <div className='EventOverlay-videoWrapper'>
            <CloseButton handleClose={this.handlePlayVideo.bind(this, false)} />
            <ReactPlayer className='EventOverlay-video' url={this.state.videoUrl} playing />
          </div>
        }
      </Overlay>
    );
  }

  handlePlayVideo(show) {
    this.setState({showVideo: show});
  }
}
