import React, {PropTypes, PureComponent } from 'react';
import GoogleMap from 'google-map-react';
import GoogleMapsModal from './GoogleMapsModal';

import './GoogleMaps.css';

export default class GoogleMaps extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visibleModals: []
    };
  }

  render() {
    const Marker = ({onClick}) => <div className='GoogleMaps-marker' onClick={onClick} />;

    const Markers = this.props.markers && this.props.markers.map((marker) => {
      return (
        <Marker
          onClick={() => this.handleMarkerClick(marker.id)}
          key={marker.id}
          lat={marker.lat}
          lng={marker.lng}
        />
      );
    });

    const Modals = this.props.markers && this.props.markers.map((marker) => {
      return (
        <GoogleMapsModal
          lat={marker.lat}
          lng={marker.lng}
          key={marker.id + '-modal'}
          visible={this.state.visibleModals.includes(marker.id)}
        />
      );
    });

    return (
      <div style={{
        height: 'calc( 80vh - 4.6875rem - 3.25rem)',
        width: '1340px',
        marginLeft: '0.85rem'}}
      >
        <GoogleMap
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          bootstrapURLKeys={{key: this.props.apiKey, language: this.props.lang}}
        >
        {Markers}
        {Modals}
        </GoogleMap>
      </div>
    );
  }
  handleMarkerClick(modalId) {
    const visibleModals = this.state.visibleModals;
    this.setState(visibleModals.includes(modalId)
      ? {visibleModals: visibleModals.filter(x => x !== modalId)}
      : {visibleModals: visibleModals.concat([modalId])});
  }
}

GoogleMaps.propTypes = {
  markers: PropTypes.array,
  zoom: PropTypes.number,
  center: PropTypes.object,
  apiKey: PropTypes.string,
  lang: PropTypes.string
};

GoogleMaps.defaultProps = {
  center: {lat: 56.0456282, lng: 12.7045333},
  zoom: 15,
  markers: [],
  apiKey: 'AIzaSyAmIiexMwCIAGIfiHHwHsvxB-srsBEvftQ',
  lang: 'en'
};
