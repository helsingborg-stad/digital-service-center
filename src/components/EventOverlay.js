import React, { Component, PropTypes } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import Link from './Link';
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

const EventDate = ({start, end}) => (
  <div>
    <span className='EventOverlay-dateGraphic'>
      {start.day}
      <br />
      <span className='EventOverlay-dateGraphic__month'>
        {start.month}
      </span>
    </span>
    <span className='EventOverlay-date'>
      {start.time}
    </span>
    { end.day > (start.day)
    ? <span className='EventOverlay-dateSeparator'>–</span>
    : <span className='EventOverlay-dateSeparator EventOverlay-dateSeparator--narrow'>-</span>
    }
    { end.day > (start.day) &&
    <span className='EventOverlay-dateGraphic'>
      {end.day}
      <br />
      <span className='EventOverlay-dateGraphic__month'>
        {end.month}
      </span>
    </span>
    }
    <span className='EventOverlay-date'>
      {end.time}
    </span>
  </div>
);

const EventOverlay = ({event, handleClose, showVideoButton, onVideoButtonClick}) => {
  return (
  <div className='EventOverlay'>
    <div style={{position: 'absolute', top: '-2.5rem', right: '0'}}>
      <CloseButton handleClose={handleClose} />
    </div>
    <img className='EventOverlay-img' src={event.imgUrl} alt={ event.name } />
    <h2 className='EventOverlay-heading'>{ event.name }</h2>
      <div style={{width: '58%', marginRight: '5%', float: 'left'}}>
        <Scrollbars style={{ marginTop: '1rem', width: 'calc(100% + 1rem)' }} autoHeight autoHeightMax='100vh - 4.6875rem - 1.25rem - (550px)'>
          { event.content &&
          <span className='EventOverlay-content-scrollWrapper'>
            <span
              className='EventOverlay-content'
              dangerouslySetInnerHTML={{ __html: event.content.replace(/\r\n/g, '<br />') }}
            />
          </span>
          }
        </Scrollbars>
      </div>
    <div style={{width: '37%', float: 'right'}}>
    { (event.openingHours && !!event.openingHours.length) &&
    <div className='EventOverlay-metaBox'>
      <h3>Date and time</h3>
      { event.openingHours.map(date => <span>{date}<br /></span>)
      }
    </div>
    }
    { (event.occasions && !!event.occasions.length) &&
    <div className='EventOverlay-metaBox'>
      <h3>Date and time</h3>
      { event.occasions.map(occ => <EventDate
                                      start={getDateFormatted(occ.startDate)}
                                      end={getDateFormatted(occ.endDate)}
                                      key={Math.random()} />)
      }
    </div>
    }
    { getLocation(event) &&
    <div className='EventOverlay-metaBox'>
      <h3>Location</h3>
      { getLocation(event) }
    </div>
    }
    { (event.contactEmail || event.contactPhone) &&
    <div className='EventOverlay-metaBox'>
      <h3>Contact</h3>
      { event.contactEmail &&
      <div><a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a></div>
      }
      { (event.contactEmail && event.contactPhone) && <div style={{height: '0.5rem'}} /> }
      { event.contactPhone &&
      <div><a href={`tel:${event.contactPhone}`}>{event.contactPhone}</a></div>
      }
    </div>
    }
    {/*TODO: implement moreinformation links from back-end*/}
    { event.moreInformation &&
    <div className='EventOverlay-metaBox'>
      <h3>More information</h3>
      <ul>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
        <li><a href='#asdf'>When flowers rhodedendron</a></li>
      </ul>
    </div>
    }
    <div className='EventOverlay-buttonWrapper'>
      { showVideoButton &&
      <button className='EventOverlay-videoButton' onClick={onVideoButtonClick}>
        Video
      </button>
      }
      <a href='#asdf' className='EventOverlay-button'>
        Take me there
      </a>
      { event.bookingLink &&
      <Link iframe={{url:event.bookingLink}} className='EventOverlay-button'>
        Tickets
      </Link>
      }
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
