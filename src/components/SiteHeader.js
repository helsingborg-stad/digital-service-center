import React, { Component } from 'react';
import './SiteHeader.css';
import PaperRipple from 'react-paper-ripple';
import SearchField from './SearchField';
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
        { this.props.children }
        <div style={{float: 'right', marginRight: '2rem'}}>
          <div style={{float: 'left', marginTop: '17px'}}>
            <SearchField inline />
          </div>
          <div style={{float: 'left'}}>
            <button className='SiteHeader-wifi'>Helsingborg Free Wifi</button>
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
      <PaperRipple tag='a' className='SiteHeaderLink' href={this.props.href}>
        {this.props.name}
      </PaperRipple>
    );
  }
}

SiteHeaderLink.propTypes = {
  href: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired
};