import React, { PropTypes } from 'react';
import closeCrossSvg from '../media/close-cross.svg';
import './IframeOverlay.css';

const IframeOverlayBackdrop = ({children}) => (
  <div className='IframeOverlayBackdrop'>{children}</div>
);

IframeOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired
};

const IframeOverlay = ({url, handleClose}) => {
  return (
  <IframeOverlayBackdrop>
    <div className='IframeOverlay'>
      <div className='IframeOverlay-closeButton-wrapper'>
        <button className='IframeOverlay-closeButton' onClick={handleClose}>
          <img src={closeCrossSvg} alt="Close" />
        </button>
      </div>
      <iframe
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        width="100%"
        height="100%"
        style={{borderRadius: '5px'}}
        src={url}
      />
    </div>
  </IframeOverlayBackdrop>
  );
};

IframeOverlay.propTypes = {
  handleClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
};

export default IframeOverlay;
