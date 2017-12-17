import PropTypes from 'prop-types';
import React from 'react';
import GoogleMap from 'google-map-react';
import GoogleMapsModal from './GoogleMapsModal';

import './GoogleMaps.css';

const Marker = ({onClick, color, name}) => (
  <div className='GoogleMaps-marker' style={{background: color}} onClick={onClick}>
    <span className='GoogleMaps-marker__name'>{name}</span>
  </div>
);

Marker.propTypes = {
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  name: PropTypes.string
};

Marker.defaultProps = {
  color: '#d00f49'
};

const GoogleMaps = ({center, zoom, apiKey, lang, markers, visibleModals,
                     handleToggleModalVisibility, handleShowMoreInfo}) => {
  return (
      <GoogleMap
        defaultCenter={center}
        defaultZoom={zoom}
        bootstrapURLKeys={{key: apiKey, language: lang}}
      >
        { markers.map((marker) => {
          return (
            <Marker
              onClick={() => handleToggleModalVisibility(marker.id)}
              key={marker.id}
              lat={marker.lat}
              lng={marker.lng}
              color={marker.activeColor}
              name={marker.eventData.name}
            />
          );
        }) }
        { markers.map((marker) => {
          return (
            <GoogleMapsModal
              lat={marker.lat}
              lng={marker.lng}
              id={marker.id + '-modal'}
              key={marker.id + '-modal'}
              visible={visibleModals.includes(marker.id)}
              onCloseClick={() => handleToggleModalVisibility(marker.id)}
              eventData={marker.eventData}
              handleShowMoreInfo={handleShowMoreInfo}
            />
          );
        }) }
      </GoogleMap>
  );
};

GoogleMaps.propTypes = {
  markers: PropTypes.array,
  visibleModals: PropTypes.array,
  zoom: PropTypes.number,
  center: PropTypes.object,
  apiKey: PropTypes.string,
  lang: PropTypes.string,
  handleToggleModalVisibility: PropTypes.func,
  handleShowMoreInfo: PropTypes.func
};

GoogleMaps.defaultProps = {
  center: {lat: 56.0456282, lng: 12.7045333},
  zoom: 15,
  markers: [],
  apiKey: '',
  lang: 'en',
  handleToggleModalVisibility: () => {},
  handleShowMoreInfo: () => {}
};

export default GoogleMaps;