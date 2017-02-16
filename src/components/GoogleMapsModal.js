import React, {PropTypes, Component} from 'react';
import PaperRipple from 'react-paper-ripple';
import classnames from 'classnames';

import './GoogleMapsModal.css';

const Modal = ({showMoreInfo, handleShowMoreClick, visible}) => {
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
        <img className='GoogleMapsModal-img' src='http://lorempixel.com/330/175' role='presentation' />
        <h4 className='GoogleMapsModal-heading'>Olympia</h4>
        <div className='GoogleMapsModal-preamble'>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
        </div>
      </div>
      { showMoreInfo &&
      <div style={{float: 'left', width: '330px', paddingLeft: '1.5rem'}}>
        <div className='GoogleMapsModal-moreInfo'>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
          <p>
            <b>Opening hours</b>: Mon - friday: 10 - 19
          </p>
          <p>
            <b>Contact</b>: <a href='mailto:info@sofiero.se'>info@sofiero.se</a>
          </p>
        </div>
      </div>
      }
      <div className='GoogleMapsModal-buttonWrapper'>
        <PaperRipple tag='a' href='#asdf' className='GoogleMapsModal-button GoogleMapsModal-button--emphasized'>
          Navigate
        </PaperRipple>
        <PaperRipple tag='button' onClick={handleShowMoreClick} className='GoogleMapsModal-button GoogleMapsModal-button--alignRight'>
          More info
        </PaperRipple>
      </div>
    </div>
  );
};

Modal.propTypes = {
  showMoreInfo: PropTypes.bool,
  handleShowMoreClick: PropTypes.func,
  visible: PropTypes.bool
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
  visible: PropTypes.bool
};
