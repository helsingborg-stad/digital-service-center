import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

class GoogleMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null
    };
  }

  componentWillReceiveProps({markers}) {
    // Fit map bounds to markers every time component receives new props
    const { map } = this.state;

    if (!map || !markers.length || typeof window === 'undefined' || !window.google) {
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(m => {
      bounds.extend(new window.google.maps.LatLng(m.lat, m.lng));
    });
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);

    const newZoom = map.getZoom();
    if (newZoom > 15) {
      map.setZoom(15);
    } else if (newZoom < 11) {
      map.setZoom(11);
    }
  }

  render() {
    const {center, zoom, apiKey, lang, markers, visibleModals,
      handleToggleModalVisibility, handleShowMoreInfo} = this.props;
    return (
      <GoogleMap
        defaultCenter={center}
        defaultZoom={zoom}
        bootstrapURLKeys={{key: apiKey, language: lang}}
        onGoogleApiLoaded={({map}) => this.setState({map})}
        yesIWantToUseGoogleMapApiInternals
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
  }
}

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
