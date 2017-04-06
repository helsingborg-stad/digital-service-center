import React, { PropTypes } from 'react';
import closeCrossSvg from '../media/close-cross.svg';
import './IframeOverlay.css';

const IframeOverlayBackdrop = ({children}) => (
  <div className='IframeOverlayBackdrop'>{children}</div>
);

IframeOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired
};

const IframeOverlay = ({url, maxWidth, maxHeight, offsetTop, offsetLeft, handleClose}) => {
  return (
  <IframeOverlayBackdrop>
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
  </IframeOverlayBackdrop>
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

export default IframeOverlay;
