import React, { Component } from 'react';
import './SiteHeader.css';
import Link from './Link';
import Logo from './Logo';
import { Link as RouterLink } from 'react-router';
import ReactInterval from 'react-interval';

function getCurrentTime() {
  const date = new Date();
  const minutes = date.getMinutes() <= 9
    ? '0' + date.getMinutes() : date.getMinutes();
  return `${date.getHours()}:${minutes}`;
}

export default class SiteHeader extends Component {
  constructor() {
    super();
    this.state = {
      currentTime: getCurrentTime()
    };
  }
  render() {
    return (
      <div className='SiteHeader' style={{backgroundColor: this.props.bgColor}}>
        <h1 className='SiteHeader-heading'>{this.props.heading}</h1>
        <div style={{float: 'right', paddingRight: '2rem'}}>
          <div style={{float: 'left', paddingRight: '2.5rem'}}>
            <Logo className='SiteSubHeader-logo' color='#fbfbfb' style={{width: '125px', paddingTop: '1.23rem'}} />
          </div>
          <div style={{float: 'left', paddingRight: '2.5rem'}}>
            { this.props.freeWifiLink &&
            <Link iframe={this.props.freeWifiLink} className='SiteHeader-wifi'>
              Helsingborg Free Wifi
            </Link>
            }
          </div>
          <div style={{float: 'left'}}>
            <span className='SiteHeader-clock'>
              <ReactInterval timeout={5000} enabled={true}
                callback={() => {
                  const time = getCurrentTime();
                  if (this.state.currentTime !== time) {
                    this.setState({currentTime: time});
                  }
                }}
              />
              { this.state.currentTime }
            </span>
          </div>
        </div>
      </div>
    );
  }
}

SiteHeader.propTypes = {
  heading: React.PropTypes.string,
  bgColor: React.PropTypes.string,
  freeWifiLink: React.PropTypes.object,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

SiteHeader.defaultProps = {
  heading: '',
  bgColor: '#333'
};

export class SiteHeaderLink extends Component {
  render() {
    return (
      <Link className='SiteHeaderLink' iframe={{ url: this.props.href}}>
        {this.props.name}
      </Link>
    );
  }
}

SiteHeaderLink.propTypes = {
  href: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired
};
