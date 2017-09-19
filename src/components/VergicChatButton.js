import React, { Component, PropTypes } from 'react';
import { isChatOpen, joinVideoChat, joinTextChat, subscribeToLeavingChat } from '../util/vergic';
import { connect } from 'react-redux';
import cn from 'classnames';

import './VergicChatButton.css';

/* eslint-disable no-underscore-dangle */

export class VergicChatButton extends Component {
  constructor() {
    super();
    this.state = {
      chatIsAvailable: false,
      chatIsInitiated: false,
      chatListIsVisible: false
    };
  }
  componentWillMount() {
    this.setState({
      chatIsAvailable: isChatOpen({type: 'video'}) || isChatOpen({type: 'text'})
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
      !this.state.chatIsInitiated && this.state.chatIsAvailable;
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
    if(isChatOpen({type: 'video'}) && isChatOpen({type: 'text'}) && this.shouldShowButton()) {
      return <div className="VergicChatOptions">
        <button onClick={this.toggleChatOptions.bind(this)} className={this.props.className}>{this.props.translatables.chatWithUs}</button>
        <ul {...this.props.color ? {style: {background: this.props.color, color: '#fff'}} : null} className={cn('VergicChatOptionsList', {'VergicChatOptionsList--visible': this.state.chatListIsVisible})}>
          <li><button {...this.props.color ? {style: {color: '#fff'}} : null} onClick={this.joinChatText.bind(this, this.props.pageName)}>Text</button></li>
          <li><button {...this.props.color ? {style: {color: '#fff'}} : null} onClick={this.joinChatVideo.bind(this, this.props.pageName)}>Video</button></li>
        </ul>
      </div>;
    }
    else if(isChatOpen({type: 'text'}) && this.shouldShowButton()) {
      return <button
        className={this.props.className}
        onClick={this.joinChatText.bind(this, this.props.pageName)}>{this.props.translatables.chatWithUs}</button>
    }
    else if(isChatOpen({type: 'video'}) && this.shouldShowButton()) {
      return <button
        className={this.props.className}
        onClick={this.joinChatVideo.bind(this, this.props.pageName)}>{this.props.translatables.chatWithUs}</button>
    }
    else {
      return null;
    }
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
