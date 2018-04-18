import PropTypes from 'prop-types';
import React, { Component } from 'react';
import closeCrossSvg from '../media/close-cross.svg';
import './OverlayBackdrop.css';
import OverlayCloser, { setOverlayCloserPosition } from './OverlayCloser';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const CloseButton = ({handleClose}) => (
  <div className='Overlay-closeButton-wrapper'>
    <button className='Overlay-closeButton'
      onClick={ (ev) => {
        ev.stopPropagation(); handleClose(ev);
      } }>
      <img src={closeCrossSvg} alt="Close" />
    </button>
  </div>
);

const OverlayBackdrop = ({children, ...props}) => (
  <div {...props} className='OverlayBackdrop'>{children}</div>
);

OverlayBackdrop.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

const OverlayWrapper = ({handleClose, children, className = 'Overlay', showCloseButton = true}) => {
  return (
    <div className={`${className}-Wrapper`}>
      <div className={className} onClick={ev => ev.stopPropagation()}>
        { showCloseButton && <CloseButton handleClose={handleClose} /> }
        { children }
      </div>
    </div>
  );
};

OverlayWrapper.propTypes = {
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  className: PropTypes.string,
  showCloseButton: PropTypes.bool
};

const IframeOverlayWrapper = ({url, maxWidth, maxHeight, offsetTop, offsetLeft, handleClose}) => {
  return (
    <OverlayWrapper handleClose={handleClose} className='OverlayIframe'>
      <div style={{overflow: 'hidden', width: '100%', height: '100%', textAlign: 'center'}}>
        <iframe
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          width="100%"
          height="100%"
          style={{
            background: '#fff',
            borderRadius: '5px',
            maxWidth: maxWidth > 0 ? maxWidth : 'none',
            maxHeight: maxHeight > 0 ? maxHeight : 'none',
            marginTop: -offsetTop,
            marginLeft: -offsetLeft
          }}
          src={url}
          title={url}
        />
      </div>
    </OverlayWrapper>
  );
};

IframeOverlayWrapper.propTypes = {
  handleClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetLeft: PropTypes.number
};

IframeOverlayWrapper.defaultProps = {
  maxWidth: 0,
  maxHeight: 0,
  offsetTop: 0,
  offsetLeft: 0
};

export default class Overlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmClose: false
    };
  }
  static propTypes = {
    handleClose: PropTypes.func.isRequired
  }
  onBackDropClick(e) {
    this.setState({showConfirmClose: !this.state.showConfirmClose});
    const closeConfirmEl = this.refs.closeconfirm.wrappedInstance.refs.wrapper;
    setOverlayCloserPosition(e, closeConfirmEl);
  }
  render() {
    return (
      <OverlayBackdrop onClick={this.onBackDropClick.bind(this)}>
        <OverlayCloser ref='closeconfirm'
          onCloseModal={this.props.handleClose} isHidden={!this.state.showConfirmClose}
          onDismissClose={() => this.setState({showConfirmClose: false})}
        />
        {this.props.children}
      </OverlayBackdrop>
    );
  }
}

export const IframeOverlay = ({handleClose, ...props}) => (
  <Overlay handleClose={handleClose}>
    <IframeOverlayWrapper {...props}
      onClick={ev => ev.stopPropagation()}
      handleClose={handleClose} />
  </Overlay>
);

export const AddressSearchOverlay = ({handleClose, ...props}) => (
  <Overlay handleClose={handleClose}>
    <OverlayWrapper {...props} handleClose={handleClose} showCloseButton={false} />
  </Overlay>
);

export const OverlayTransitionWrapper = ({children}) => (
  <ReactCSSTransitionGroup
    transitionName="Overlay-transitionGroup"
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    transitionEnter={true}
    transitionLeave={true}
  >
    {children}
  </ReactCSSTransitionGroup>
);

OverlayTransitionWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};
