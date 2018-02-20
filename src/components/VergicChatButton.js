import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isChatOpen, joinVideoChat, joinTextChat, subscribeToLeavingChat } from '../util/vergic';
import { connect } from 'react-redux';
import cn from 'classnames';

import './VergicChatButton.css';

/* eslint-disable no-underscore-dangle */

export class VergicChatButton extends Component {
  constructor() {
    super();
    this.state = {
      textChatIsAvailable: false,
      videoChatIsAvailable: false,
      chatIsInitiated: false,
      chatListIsVisible: false
    };
  }
  componentDidMount() {
    isChatOpen({type: 'text'}).then(isOpen => {
      this.setState({
        textChatIsAvailable: isOpen
      });
    });
    isChatOpen({type: 'video'}).then(isOpen => {
      this.setState({
        videoChatIsAvailable: isOpen
      });
    });
    setTimeout(() => {
      if (typeof window !== 'undefined' && !window.__vergicChatHasLeaveEventListener) {
        subscribeToLeavingChat().then(() => setTimeout(() => window.location.reload(), 500));
        window.__vergicChatHasLeaveEventListener = true;
      }
    }, 4000);
  }
  toggleChatOptions() {
    this.setState({
      chatListIsVisible: !this.state.chatListIsVisible
    });
  }
  joinChatVideo(pageName) {
    if (window) {
      window.__isVergicChatOpen = true;
    }
    joinVideoChat(pageName);
    this.setState({
      chatIsInitiated: true
    });
  }
  joinChatText(pageName) {
    if (window) {
      window.__isVergicChatOpen = true;
    }
    joinTextChat(pageName);
    this.setState({
      chatIsInitiated: true
    });
  }
  render() {
    if (!this.props.showChat) {
      return null;
    }
    if (this.state.textChatIsAvailable && this.state.videoChatIsAvailable) {
      const buttonStyle = this.props.color ? {style: {color: '#fff'}} : null;
      return <div className="VergicChatOptions">
        <button onClick={this.toggleChatOptions.bind(this)} className={this.props.className}>
          {this.props.translatables.chatWithUs}
        </button>
        <ul
          {...this.props.color ? {style: {background: this.props.color, color: '#fff'}} : null}
          className={cn('VergicChatOptionsList',
            {'VergicChatOptionsList--visible': this.state.chatListIsVisible})}
        >
          <li>
            <button {...buttonStyle} onClick={this.joinChatText.bind(this, this.props.pageName)}>
              Text
            </button>
          </li>
          <li>
            <button {...buttonStyle} onClick={this.joinChatVideo.bind(this, this.props.pageName)}>
              Video
            </button>
          </li>
        </ul>
      </div>;
    } else if (this.state.textChatIsAvailable) {
      return <button
        className={this.props.className}
        onClick={this.joinChatText.bind(this, this.props.pageName)}
      >
        {this.props.translatables.chatWithUs}
      </button>;
    } else if (this.state.videoChatIsAvailable) {
      return <button
        className={this.props.className}
        onClick={this.joinChatVideo.bind(this, this.props.pageName)}
      >
        {this.props.translatables.chatWithUs}
      </button>;
    }
    return null;
  }
}

VergicChatButton.propTypes = {
  className: PropTypes.string,
  pageName: PropTypes.string,
  showChat: PropTypes.bool,
  color: PropTypes.string,
  translatables: PropTypes.shape({
    chatWithUs: PropTypes.string.isRequired
  }).isRequired
};

VergicChatButton.defaultProps = {
  className: '',
  pageName: ''
};

const mapStateToProps = (state) => {
  return {
    showChat: state.siteSettings.showChat,
    translatables: state.siteSettings.translatables[state.activeLanguage]
  };
};

export default connect(mapStateToProps, null)(VergicChatButton);
