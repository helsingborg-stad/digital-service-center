import React, { PropTypes } from 'react';
import closeCrossSvg from '../media/close-cross.svg';
import './PageOverlay.css';

const PageOverlayBackdrop = ({children}) => (
  <div className='PageOverlayBackdrop'>{children}</div>
);

PageOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired
};

const PageOverlay = ({markup, handleClose}) => {
  return (
  <PageOverlayBackdrop>
    <div className='PageOverlay'>
      <div className='PageOverlay-closeButton-wrapper'>
        <button className='PageOverlay-closeButton' onClick={handleClose}>
          <img src={closeCrossSvg} alt="Close" />
        </button>
      </div>
      <div className='PageOverlay-inner' dangerouslySetInnerHTML={{__html: markup }} />
    </div>
  </PageOverlayBackdrop>
  );
};

PageOverlay.propTypes = {
  handleClose: PropTypes.func.isRequired,
  markup: PropTypes.string.isRequired
};

export default PageOverlay;
