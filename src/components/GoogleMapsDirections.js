/* global google */
import {
  default as React,
  Component
} from 'react';

import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from 'react-google-maps';

import './GoogleMapsDirections.css';
import closeCrossSvg from '../media/close-cross.svg';


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
      travelMode: window.google.maps.DRIVING,
      directions: null
    };
  }

  componentDidMount() {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: this.state.origin,
      destination: this.state.destination,
      travelMode: google.maps.TravelMode.DRIVING
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
      <div style={{ width: '100%', height: '100%' }}>
        <button className='GoogleMapsDirections-closeButton' onClick={this.props.handleClose}>
          <img src={closeCrossSvg} alt="Close" />
        </button>
        <GoogleMapsDirection
          containerElement={
            <div style={{ width: '100%', height: '100%' }} />
          }
          mapElement={
            <div style={{ width: '100%', height: '100%' }} />
          }
          center={this.state.origin}
          directions={this.state.directions}
        />
      </div>
    );
  }
}

GoogleMapsDirections.propTypes = {
  origin: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired
  }),
  destination: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired
  }),
  directions: React.PropTypes.object,
  handleClose: React.PropTypes.func
};
