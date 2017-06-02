import React, { Component, PropTypes } from 'react';
import { isChatOpen, joinTextChat, subscribeToLeavingChat } from '../util/vergic';
import { connect } from 'react-redux';

/* eslint-disable no-underscore-dangle */

export class VergicChatButton extends Component {
  constructor() {
    super();
    this.state = {
      chatIsAvailable: false,
      chatIsInitiated: false
    };
  }
  componentWillMount() {
    this.setState({
      chatIsAvailable: isChatOpen()
    });
    setTimeout(() => {
      if (typeof window !== 'undefined' && !window.__vergicChatHasLeaveEventListener) {
        subscribeToLeavingChat().then(() => setTimeout(() => location.reload(), 500));
        window.__vergicChatHasLeaveEventListener = true;
      }
    }, 1000);
  }
  shouldShowButton() {
    return this.props.showChat &&
      (typeof window !== 'undefined' && !window.__isVergicChatOpen) &&
      !this.state.chatIsInitiated;
  }
  joinChat(pageName) {
    if (window) {
      window.__isVergicChatOpen = true;
    }
    joinTextChat(pageName);
    this.setState({
      chatIsInitiated: true
    });
  }
  render() {
    return this.shouldShowButton()
      ? <button
        className={this.props.className}
        onClick={this.joinChat.bind(this, this.props.pageName)}>{this.props.translatables.chatWithUs}</button>
      : null;
  }
}

VergicChatButton.propTypes = {
  className: PropTypes.string,
  pageName: PropTypes.string,
  showChat: PropTypes.bool,
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
