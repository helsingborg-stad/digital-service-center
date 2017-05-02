import React, {PropTypes} from 'react';
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
  lng}) => {
  return (
    <div
      className={classnames(
        'GoogleMapsModal',
        visible && 'GoogleMapsModal--visible')
      }
    >
      <div className='GoogleMapsModal-triangle' />
      <div>
        <img className='GoogleMapsModal-img' src={eventData.imgUrl} role='presentation' />
        <h4 className='GoogleMapsModal-heading'>{eventData.name}</h4>
        <div className='GoogleMapsModal-preamble'>
          <p>{eventData.shortContent}</p>
        </div>
      </div>
      <div className='GoogleMapsModal-buttonWrapper'>
        <LoadingButton
          onClick={() => handleNavigationClick(lat, lng, handleShowDirections)}
          cssClassName='GoogleMapsModal-button GoogleMapsModal-button--emphasized'
          text='Navigate'
          style={{padding: '0.5rem 1rem', fontSize: '0.8125rem', background: '#c70d53'}}
          />

        <RippleButton
          onClick={() => handleShowMoreInfo(eventData.slug)}
          className='GoogleMapsModal-button GoogleMapsModal-button--alignRight'
        >
          More info
        </RippleButton>

      </div>
    </div>
  );
};

/*GoogleMapsModal.propTypes = {
  onShowMoreInfo: PropTypes.func,
  visible: PropTypes.bool,
  eventData: PropTypes.shape({
    name: PropTypes.string,
    content: PropTypes.string
  })
};

export default class GoogleMapsModal extends Component {
  render() {
    return (
      <Modal
        key={this.props.id}
        onShowMoreInfo={this.props.handleShowMoreInfo}
        visible={this.props.visible}
        eventData={this.props.eventData}
      />
    );
  }
}*/

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
  handleShowDirections: PropTypes.func.isRequired
};

export default GoogleMapsModal;
