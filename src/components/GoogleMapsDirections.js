/* global google */
import PropTypes from 'prop-types';

import { default as React, Component } from 'react';

import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from 'react-google-maps';

import './GoogleMapsDirections.css';


const GoogleMapsDirection = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={props.zoom}
    defaultCenter={props.center}
    defaultOptions={{disableDefaultUI: true}}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

export default class GoogleMapsDirections extends Component {
  constructor({origin, destination}) {
    super();
    this.state ={
      origin: origin,
      destination: destination,
      travelMode: 'WALKING',
      directions: null
    };
  }

  componentDidMount() {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: this.state.origin,
      destination: this.state.destination,
      travelMode: this.state.travelMode
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result
        });
      } else {
        // eslint-disable-next-line no-console
        console.error(`error fetching directions ${result}`);
      }
    });
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className='GoogleMapsDirections-eventName'>
          {this.props.eventName}
        </div>
        <GoogleMapsDirection
          containerElement={
            <div style={{ width: '100%', height: '100%', minHeight: '40vh' }} />
          }
          mapElement={
            <div style={{ width: '100%', height: '100%' }} />
          }
          center={this.state.origin}
          directions={this.state.directions}
        />
        <button className='GoogleMapsDirections-closeButton' onClick={this.props.handleClose}>
          {this.props.showInformationText}
        </button>
      </div>
    );
  }
}

GoogleMapsDirections.propTypes = {
  eventName: PropTypes.string.isRequired,
  origin: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  destination: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  directions: PropTypes.object,
  handleClose: PropTypes.func,
  showInformationText: PropTypes.string
};