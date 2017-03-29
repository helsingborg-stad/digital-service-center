import React, {PropTypes, Component} from 'react';
import Link from './Link';
import { RippleButton } from './react-ripple-effect';
import classnames from 'classnames';

import './GoogleMapsModal.css';

const Modal = ({onShowMoreInfo, visible, eventData}) => {
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
        <Link href='#asdf' className='GoogleMapsModal-button GoogleMapsModal-button--emphasized'>
          Navigate
        </Link>
        <RippleButton
          onClick={() => onShowMoreInfo(eventData.id)}
          className='GoogleMapsModal-button GoogleMapsModal-button--alignRight'
        >
          More info
        </RippleButton>
      </div>
    </div>
  );
};

Modal.propTypes = {
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
}

GoogleMapsModal.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  handleShowMoreInfo: PropTypes.func.isRequired,
  eventData: PropTypes.shape({
    name: PropTypes.string,
    content: PropTypes.string
  })
};
