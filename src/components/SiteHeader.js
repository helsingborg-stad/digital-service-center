import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './SiteHeader.css';
import Link from './Link';
import Logo from './Logo';
import ReactInterval from 'react-interval';

function getCurrentTime() {
  const date = new Date();
  const minutes = date.getMinutes() <= 9
    ? '0' + date.getMinutes() : date.getMinutes();
  return `${date.getHours()}:${minutes}`;
}

export class SiteHeader extends Component {
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
            <Logo className='SiteHeader-logo' color='#fbfbfb' style={{width: '125px', paddingTop: '1.23rem'}} />
          </div>
          <div style={{float: 'left', paddingRight: '2.5rem'}}>
            { this.props.freeWifiLink &&
            <Link iframe={this.props.freeWifiLink} className='SiteHeader-wifi'>
              {this.props.translatables.helsingborgFreeWifi}
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
  heading: PropTypes.string,
  bgColor: PropTypes.string,
  freeWifiLink: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  translatables: PropTypes.shape({
    helsingborgFreeWifi: PropTypes.string.isRequired
  }).isRequired
};

SiteHeader.defaultProps = {
  heading: '',
  bgColor: '#333'
};

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables[state.activeLanguage]
  };
};

export default connect(mapStateToProps, null)(SiteHeader);

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
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
