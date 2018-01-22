import PropTypes from 'prop-types';
import React from 'react';
import './MultimediaBackground.css';

const MultimediaBackground = ({ backgroundUrl, children }) => {
  const isVideo = backgroundUrl.endsWith('.mp4') || backgroundUrl.endsWith('.webm');
  if (isVideo) {
    return (
      <div>
        <div className='MultimediaBackground--video'>
          <video className='MultimediaBackground--video__video' autoPlay loop muted>
            <source src={backgroundUrl} />
          </video>
        </div>
        { children }
      </div>
    );
  }
  return (
    <div className='MultimediaBackground' style={{ backgroundImage: `url(${backgroundUrl})` }}>
      { children }
    </div>
  );
};

export default MultimediaBackground;

MultimediaBackground.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  backgroundUrl: PropTypes.string
};
