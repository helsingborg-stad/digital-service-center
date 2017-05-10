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
    if (typeof window !== 'undefined' && !window.__vergicChatHasLeaveEventListener) {
      subscribeToLeavingChat().then(() => setTimeout(() => location.reload(), 1500));
      window.__vergicChatHasLeaveEventListener = true;
    }
  }
  shouldShowButton() {
    return this.props.buttonText &&
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
        onClick={this.joinChat.bind(this, this.props.pageName)}>{this.props.buttonText}</button>
      : null;
  }
}

VergicChatButton.propTypes = {
  className: PropTypes.string,
  pageName: PropTypes.string,
  buttonText: PropTypes.string
};

VergicChatButton.defaultProps = {
  className: '',
  pageName: ''
};

const mapStateToProps = (state) => {
  return {
    buttonText: state.siteSettings.chatButtonText
  };
};

export default connect(mapStateToProps, null)(VergicChatButton);
