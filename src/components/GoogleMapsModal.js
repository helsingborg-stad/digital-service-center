import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import LoadingButton from './LoadingButton.js';
import { RippleButton } from './react-ripple-effect';
import classnames from 'classnames';
import './GoogleMapsModal.css';
import getUserLocation from '../util/getUserLocation';


const handleNavigationClick = (destinationLat, destinationLng, callback) => {
  getUserLocation().then((location) => {
    callback({
      origin: {lat: location.lat, lng: location.lng},
      destination: {lat: destinationLat, lng: destinationLng}
    });
  });
};

const GoogleMapsModal = ({
  handleShowMoreInfo,
  visible,
  eventData,
  handleShowDirections,
  lat,
  lng,
  translatables}) => {
  return (
    <div
      className={classnames(
        'GoogleMapsModal',
        visible && 'GoogleMapsModal--visible')
      }
    >
      <div className='GoogleMapsModal-triangle' />
      <div>
        { eventData.imgUrl &&
        <img className='GoogleMapsModal-img' src={eventData.imgUrl} role='presentation' />
        }
        <h4 className='GoogleMapsModal-heading'>{eventData.name}</h4>
        <div className='GoogleMapsModal-preamble'>
          <p dangerouslySetInnerHTML={{ __html: eventData.shortContent }} />
        </div>
      </div>
      <div className='GoogleMapsModal-buttonWrapper'>
        <LoadingButton
          onClick={() => handleNavigationClick(lat, lng, handleShowDirections)}
          cssClassName='GoogleMapsModal-button GoogleMapsModal-button--emphasized'
          text={translatables.navigate}
          style={{padding: '0.5rem 1rem', fontSize: '0.8125rem', background: '#c70d53'}}
          />

        <RippleButton
          onClick={() => handleShowMoreInfo(eventData)}
          className='GoogleMapsModal-button GoogleMapsModal-button--alignRight'
        >
          {translatables.moreInfo}
        </RippleButton>

      </div>
    </div>
  );
};

GoogleMapsModal.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  handleShowMoreInfo: PropTypes.func.isRequired,
  eventData: PropTypes.shape({
    name: PropTypes.string,
    content: PropTypes.string
  }),
  handleShowDirections: PropTypes.func.isRequired,
  translatables: PropTypes.shape({
    navigate: PropTypes.string.isRequired,
    moreInfo: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables
  };
};

export default connect(mapStateToProps, null)(GoogleMapsModal);
