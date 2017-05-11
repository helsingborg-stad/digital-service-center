import React, { PropTypes } from 'react';
import { Ripple } from './react-ripple-effect';
import { Link as RouterLink } from 'react-router';
import { connect } from 'react-redux';
import { iframeUrl } from '../actions/iframeUrl';
import classNames from 'classnames';
import formatRelativeUrl from '../util/formatRelativeUrl';

import './Link.css';

class Link extends React.Component {
  constructor() {
    super();
    this.state = {
      cursorPos: {}
    };
  }

  render() {
    if (this.props.to) {
      return (
        <RouterLink
          to={this.props.to}
          style={{position: 'relative', overflow: 'hidden'}}
          className={this.props.className}
          onClick={this.props.onClick}
          onMouseUp={ this.handleClick.bind(this) }
        >
          {this.props.children}
          <Ripple cursorPos={ this.state.cursorPos } />
        </RouterLink>
      );
    } else if (this.props.href) {
      return (
        <a
          className={this.props.className}
          style={{position: 'relative', overflow: 'hidden'}}
          href={this.props.href}
          onMouseUp={ this.handleClick.bind(this) }
        >
          {this.props.children}
          <Ripple cursorPos={ this.state.cursorPos } />
        </a>
      );
    } else if (this.props.iframe) {
      return (
        <button
          className={classNames('Link', this.props.className)}
          style={{position: 'relative', overflow: 'hidden'}}
          onClick={() => this.props.openIframe(this.props.iframe)}
          onMouseUp={ this.handleClick.bind(this) }
        >
          {this.props.children}
          <Ripple cursorPos={ this.state.cursorPos } />
        </button>
      );
    } else if (this.props.page) {
      const { url } = this.props.page;
      const formattedUrl = formatRelativeUrl(url);
      return (
        <button
          className={classNames('Link', this.props.className)}
          style={{position: 'relative', overflow: 'hidden'}}
          onClick={() => this.props.openIframe({url: formattedUrl})}
          onMouseUp={ this.handleClick.bind(this) }
        >
          {this.props.children}
          <Ripple cursorPos={ this.state.cursorPos } />
        </button>
      );
    }
    return null;
  }

  handleClick(e) {
    const cursorPos = {
      top: e.clientY,
      left: e.clientX,
      time: Date.now()
    };
    this.setState({ cursorPos: cursorPos });
  }
}

Link.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  href: PropTypes.string,
  iframe: PropTypes.shape({
    url: PropTypes.string
  }),
  page: PropTypes.shape({
    content: PropTypes.string
  }),
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  openIframe: React.PropTypes.func,
  onClick: React.PropTypes.func
};

Link.defaultProps = {
  onClick: () => {}
};

const mapDispatchToProps = (dispatch) => {
  return {
    openIframe: (url) => dispatch(iframeUrl(url))
  };
};

export default connect(null, mapDispatchToProps)(Link);
