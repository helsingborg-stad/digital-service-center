import React, { Component, PropTypes } from 'react';
import closeCrossSvg from '../media/close-cross.svg';
import './IframeOverlay.css';
import OverlayCloser, { setOverlayCloserPosition } from './OverlayCloser';

class IframeOverlayBackdrop extends Component {
  render() {
    return <div {...this.props} className='IframeOverlayBackdrop'>{this.props.children}</div>
  }
}

IframeOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired
};

const IframeOverlay = ({url, maxWidth, maxHeight, offsetTop, offsetLeft, handleClose}) => {
  return (
    <div className='IframeOverlay'>
      <div className='IframeOverlay-closeButton-wrapper'>
        <button className='IframeOverlay-closeButton' onClick={handleClose}>
          <img src={closeCrossSvg} alt="Close" />
        </button>
      </div>
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
        />
      </div>
    </div>
  );
};

IframeOverlay.propTypes = {
  handleClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetLeft: PropTypes.number
};

IframeOverlay.defaultProps = {
  maxWidth: 0,
  maxHeight: 0,
  offsetTop: 0,
  offsetLeft: 0
};

export default class extends Component {
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
      <IframeOverlayBackdrop onClick={this.onBackDropClick.bind(this)}>
        <OverlayCloser ref='closeconfirm'
          onCloseModal={this.props.handleClose} isHidden={!this.state.showConfirmClose}
          onDismissClose={() => this.setState({showConfirmClose: false})}
        />
        <IframeOverlay {...this.props} onClick={ev => ev.stopPropagation()} />
      </IframeOverlayBackdrop>
    );
  }
}
