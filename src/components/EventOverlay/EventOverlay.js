import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import Link from '../Link';
import closeCrossSvg from '../../media/close-cross.svg';
import './EventOverlay.css';
import ReactPlayer from 'react-player';
import getUserLocation from '../../util/getUserLocation';
import LoadingButton from '../LoadingButton.js';
import GoogleMapsDirections from '../GoogleMapsDirections';
import { translateData, translationIsLoading } from '../../actions/translate';
import ReactLoading from 'react-loading';
import ReactGA from 'react-ga';

import EventOverlayReviews from './components/EventOverlayReviews';
import EventOverlayRelatedInformation from './components/EventOverlayRelatedInformation';
import EventSelectLanguage from './components/EventSelectLanguage';

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
      showTranslatedContent: false,
      langSwitch: props.activeLanguage
    };
  }
  componentDidMount() {
    if (this.props.showDirections) {
      const { latitude, longitude } = this.props.event.location;
      handleNavigationClick(latitude, longitude, this.handleShowDirections.bind(this));
    }

    this.props.initiatetranslationLoading(false, this.props.event.id, 'sv');
  }
  handleShowDirections(directions) {
    this.setState({directions: directions});
  }
  handleTranslateOnClick = (lang) => {
    const whatLang = !lang
      ? this.props.activeLanguage
      : lang;
    this.setState({
      langSwitch: whatLang,
      showTranslatedContent: !this.state.showTranslatedContent
    });
  }
  contentForCurrentLanguage = () => {
    return this.state.langSwitch === this.props.activeLanguage
      ? this.props.event.content
      : this.props.event.translatedContent;
  }
  titleForCurrentLanguage = () => {
    if (this.state.langSwitch === this.props.activeLanguage) {
      return this.props.event.name;
    }
    if (this.state.langSwitch === 'en' && this.props.activeLanguage === 'sv') {
      return this.props.event.translatedTitle;
    }
    if (this.state.langSwitch === 'sv' && this.props.activeLanguage === 'en') {
      return this.props.event.translatedTitle;
    }
    return this.props.event.name;
  }
  contentForTranslatedLanguage = () => {
    const needToFetchTranslation = !['sv', 'en'].includes(this.state.langSwitch);
    return needToFetchTranslation
      ? this.props.translations[this.state.langSwitch][this.props.event.id].content
      : this.contentForCurrentLanguage();
  }

  onTranslate = (content, id, activeLang, selectedLang) => {
    ReactGA.event({
      category: 'EventTranslation',
      action: `Translated eventId: ${id} to ${selectedLang}`
    });
    return this.props.translations[selectedLang] && this.props.translations[selectedLang][id]
      ? this.props.translations[selectedLang][id].content
      : this.props.translateText(content, id, activeLang, selectedLang, this.props.googleTranslateApiKey);
  }
  render() {
    return (
      <div className='EventOverlay' onClick={ev => ev.stopPropagation()}>
        { this.state.directions ? this.renderDirections() : this.renderContent() }
      </div>
    );
  }
  renderDirections() {
    return (
      <GoogleMapsDirections
        origin={this.state.directions.origin}
        destination={this.state.directions.destination}
        handleClose={this.handleShowDirections.bind(this, null)}
        eventName={this.props.event.name}
        showInformationText={this.props.translatables.showInformation}
      />
    );
  }
  renderContent() {
    return <div>
      { this.props.event.imgUrl &&
        <div className='EventOverlay-imgWrapper'>
          <img
            className='EventOverlay-img'
            src={this.props.event.imgUrl}
            alt={ this.props.event.name } />
        </div>
      }

      <h2 className='EventOverlay-heading' dangerouslySetInnerHTML={ {__html: this.titleForCurrentLanguage()}}/>

      <div style={{width: '58%', marginRight: '5%', float: 'left'}}>
        { this.renderLeftContent() }
      </div>
      <div style={{width: '37%', float: 'right'}}>
        { this.renderRightContent() }
      </div>
    </div>;
  }
  renderTranslationButton() {
    const content = this.props.activeLanguage === 'en'
      ? this.props.event.translatedContent
      : this.props.event.content;
    return <div>
      <div style={{position: 'static'}}>
        <EventSelectLanguage
          content={content}
          eventId={this.props.event.id}
          onToggle={this.handleTranslateOnClick}
          onTranslate={this.onTranslate}
          isActive={this.state.showTranslatedContent}
          activeLanguage={this.props.activeLanguage}/>

        <div>
          <button
            onClick={() => this.handleTranslateOnClick(this.state.langSwitch)}
            disabled={this.state.showTranslatedContent && this.props.translationLoading}
            className='EventOverlay-button'>{this.props.translatables.translateButton}</button>
          <span style={{fontSize: 12, fontStyle: 'italic' }}>{this.props.translatables.translatedByGoogle}</span>
        </div>

      </div>
    </div>;
  }
  renderLeftContent() {
    const getContent = this.contentForTranslatedLanguage();
    const content = getContent || '<p></p>';

    return <Fragment>
      {!!this.props.event.rating &&
        <h3 className='EventOverlay-ratingHeading'>{`Rating: ${this.props.event.rating}/5`}</h3>
      }
      <Scrollbars
        style={{ marginTop: '1rem', width: 'calc(100% + 1rem)' }}
        autoHeight autoHeightMax='80vh - 4.6875rem - 1.25rem - (550px)'>
        { content &&
          <div>
            <span className='EventOverlay-content-scrollWrapper'>
              { this.props.translationLoading &&
              <div className='EventOverlay-spinner'>
                <ReactLoading type='spin' color='#666' height={100} width={50} />
              </div>
              }
              <span
                className='EventOverlay-content'
                dangerouslySetInnerHTML={{ __html: content.replace(/\r\n/g, '<br />')}}
              />
            </span>
          </div>}
        { !!this.props.event.rating &&
              <EventOverlayReviews reviews={this.props.event.reviews} />
        }
      </Scrollbars>
      { this.renderTranslationButton() }
    </Fragment>;
  }
  renderRightContent() {
    const showTakeMeThereButton = this.props.event.location
      && !!this.props.event.location.latitude
      && !!this.props.event.location.longitude;

    return (
      <Fragment>
        <EventOverlayRelatedInformation
          event={this.props.event}
          translatables={this.props.translatables} />

        <div className='EventOverlay-buttonWrapper'>
          { this.props.showVideoButton &&
        <button className='EventOverlay-videoButton' onClick={this.props.onVideoButtonClick}>
          Video
        </button>
          }
          { showTakeMeThereButton &&
          <LoadingButton
            onClick={() =>
              handleNavigationClick(
                this.props.event.location.latitude,
                this.props.event.location.longitude,
                this.handleShowDirections.bind(this)
              )
            }
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
      </Fragment>
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
    tickets: PropTypes.string.isRequired,
    translatedByGoogle: PropTypes.string.isRequired,
    translateButton: PropTypes.string.isRequired
  }).isRequired,
  activeLanguage: PropTypes.string,
  translateText: PropTypes.func,
  translations: PropTypes.object

};


const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables[state.activeLanguage],
    translations: state.translation,
    activeLanguage: state.activeLanguage,
    translationLoading: state.translation.loading,
    googleTranslateApiKey: state.siteSettings.googleTranslateApiKey
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    translateText: (text, id, source, target, key) => {
      return dispatch(translateData(text, id, source, target, key));
    },
    initiatetranslationLoading: (boolean) => {
      return dispatch(translationIsLoading(boolean));
    }
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
    handleClose: PropTypes.func,
    pageType: PropTypes.string
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
              {...this.props}
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
