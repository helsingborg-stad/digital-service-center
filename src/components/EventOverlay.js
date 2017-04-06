import React, { Component, PropTypes } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import closeCrossSvg from '../media/close-cross.svg';
import './EventOverlay.css';
import ReactPlayer from 'react-player';

const EventOverlayBackdrop = ({children}) => (
  <div className='EventOverlayBackdrop'>{children}</div>
);

EventOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired
};

const getLocation = (event) => {
  return event.location && event.location.streetAddress && event.location.postalCode
  ? `${event.location.streetAddress}, ${event.location.postalCode}` : null;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDateFormatted = (dateStr) => {
  const date = new Date(dateStr);
  return {
    month: monthNames[date.getMonth()],
    day: date.getDate(),
    time: `${date.getHours()}:${date.getMinutes() === 0 ? '00' : date.getMinutes()}`
  };
};

const CloseButton = ({handleClose}) => (
<div className='EventOverlay-closeButton-wrapper'>
  <button className='EventOverlay-closeButton' onClick={handleClose}>
    <img src={closeCrossSvg} alt="Close" />
  </button>
</div>
);

const EventOverlay = ({event, handleClose, showVideoButton, onVideoButtonClick}) => {
  return (
  <div className='EventOverlay'>
    <div className='EventOverlay-main'>
      <div className='EventOverlay-imgWrapper'>
        <img className='EventOverlay-img' src={event.imgUrl} />
      </div>
      <Scrollbars style={{ marginTop: '1rem', width: 'calc(100% + 1rem)', height: 'calc( 80vh - 4.6875rem - 10.25rem - 2vh - (((76vw - 325px)*0.65)*0.5625)' }}>
      <span className='EventOverlay-content-scrollWrapper'>
      <h2 className='EventOverlay-heading'>{ event.name }</h2>
        <span
          className='EventOverlay-content'
          dangerouslySetInnerHTML={{ __html: event.content.replace(/\r\n/g, '<br />') }}
        />
      </span>
      </Scrollbars>
      <div className='EventOverlay-buttonWrapper'>
        <a href='#asdf' className='EventOverlay-button'>
          Take me there
        </a>
        <a href='#asdf' className='EventOverlay-button'>
          Tickets
        </a>
        { showVideoButton &&
        <button className='EventOverlay-videoButton' onClick={onVideoButtonClick}>
          Video
        </button>
        }
      </div>
    </div>
    <div className='EventOverlay-aside'>
      <CloseButton handleClose={handleClose} />
      { event.occasions && event.occasions.length &&
      <div className='EventOverlay-asideBox'>
        {/* TODO: fix format when occasions span multiple consecutive days, and clean up the code, since right now it's a mess */}
        <h3>Date and time</h3>
        {event.occasions.map(occ => {
          return (
            <div key={Math.random}>
              <span className='EventOverlay-dateGraphic'>
                {getDateFormatted(occ.startDate).day}
                <br />
                <span className='EventOverlay-dateGraphic__month'>
                  {getDateFormatted(occ.startDate).month}
                </span>
              </span>
              <span className='EventOverlay-date'>
                {getDateFormatted(occ.startDate).time} - {getDateFormatted(occ.endDate).time}
              </span>
            </div>
          );
        })}
      </div>
      }
      { getLocation(event) &&
      <div className='EventOverlay-asideBox'>
        <h3>Location</h3>
        { getLocation(event) }
      </div>
      }
      <div className='EventOverlay-asideBox'>
        <h3>Contact</h3>
        <a href='#'>info@helsingborg.se</a>
      </div>
      <div className='EventOverlay-asideBox'>
        <h3>More information</h3>
        <ul>
          <li><a href='#asdf'>When flowers rhodedendron</a></li>
          <li><a href='#asdf'>When flowers rhodedendron</a></li>
          <li><a href='#asdf'>When flowers rhodedendron</a></li>
          <li><a href='#asdf'>When flowers rhodedendron</a></li>
          <li><a href='#asdf'>When flowers rhodedendron</a></li>
        </ul>
      </div>
    </div>
  </div>
  );
};

EventOverlay.propTypes = {
  handleClose: PropTypes.func,
  event: PropTypes.object // todo
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideo: false,
      videoUrl: props.event.youtubeUrl || props.event.vimeoUrl || null
    };
  }

  static propTypes = {
    event: PropTypes.object,
    handleClose: PropTypes.func
  }

  render() {
    return (
      <EventOverlayBackdrop>
        { !this.state.showVideo
        ?
        <EventOverlay
          event={this.props.event}
          handleClose={this.props.handleClose}
          onVideoButtonClick={this.handlePlayVideo.bind(this, true)}
          showVideoButton={this.state.videoUrl} />
        :
        <div className='EventOverlay-videoWrapper'>
          <CloseButton handleClose={this.handlePlayVideo.bind(this, false)} />
          <ReactPlayer className='EventOverlay-video' url={this.state.videoUrl} playing />
        </div>
        }
      </EventOverlayBackdrop>
    );
  }

  handlePlayVideo(show) {
    this.setState({showVideo: show});
  }
}
