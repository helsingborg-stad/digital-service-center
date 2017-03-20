import React, {PropTypes, Component} from 'react';
import Link from './Link';
import { RippleButton } from './react-ripple-effect';
import classnames from 'classnames';

import './GoogleMapsModal.css';

const Modal = ({showMoreInfo, handleShowMoreClick, visible, eventData}) => {
  return (
    <div
      className={classnames(
        'GoogleMapsModal',
        showMoreInfo && 'GoogleMapsModal--expanded',
        visible && 'GoogleMapsModal--visible')
      }
    >
      <div className='GoogleMapsModal-triangle' />
      <div style={{float: 'left', width: '306px'}}>
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
        <RippleButton onClick={handleShowMoreClick} className='GoogleMapsModal-button GoogleMapsModal-button--alignRight'>
          More info
        </RippleButton>
      </div>
    </div>
  );
};

Modal.propTypes = {
  showMoreInfo: PropTypes.bool,
  handleShowMoreClick: PropTypes.func,
  visible: PropTypes.bool,
  eventData: PropTypes.shape({
    name: PropTypes.string,
    content: PropTypes.string
  })
};

export default class GoogleMapsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMoreInfo: false
    };
  }
  render() {
    return (
      <Modal
        key={this.props.id}
        handleShowMoreClick={this.handleShowMoreInfoClick.bind(this)}
        showMoreInfo={this.state.showMoreInfo}
        visible={this.props.visible}
        eventData={this.props.eventData}
      />
    );
  }
  handleShowMoreInfoClick() {
    this.setState({showMoreInfo: !this.state.showMoreInfo});
  }
}

GoogleMapsModal.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  eventData: PropTypes.shape({
    name: PropTypes.string,
    content: PropTypes.string
  })
};
