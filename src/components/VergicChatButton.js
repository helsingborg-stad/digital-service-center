import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isChatOpen, joinChat, subscribeToLeavingChat } from '../util/vergic';
import { connect } from 'react-redux';

import './VergicChatButton.css';

/* eslint-disable no-underscore-dangle */

export class VergicChatButton extends Component {
  constructor() {
    super();
    this.state = {
      chatIsAvailable: false
    };
  }
  componentDidMount() {
    isChatOpen().then(isOpen => {
      this.setState({
        chatIsAvailable: isOpen
      });
    });
    setTimeout(() => {
      if (typeof window !== 'undefined' && !window.__vergicChatHasLeaveEventListener) {
        subscribeToLeavingChat().then(() => setTimeout(() => window.location.reload(), 500));
        window.__vergicChatHasLeaveEventListener = true;
      }
    }, 4000);
  }
  render() {
    const { showChat, color, pageName, translatables } = this.props;
    if (!showChat || !this.state.chatIsAvailable) {
      return null;
    }
    const buttonStyle = color ? {style: {color: '#fff'}} : null;
    return <button className='VergicChat' {...buttonStyle} onClick={() => joinChat(pageName)}>
      {translatables.chatWithUs}
    </button>;
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
