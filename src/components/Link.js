import React, { PropTypes } from 'react';
import { Ripple } from './react-ripple-effect';
import { Link as RouterLink } from 'react-router';
import { connect } from 'react-redux';
import { iframeUrl } from '../actions/iframeUrl';
import classNames from 'classnames';

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
      let { url } = this.props.page;
      // Add absolute path to helsingborg-dsc.local when in development mode
      // In production mode, a reverse-proxy should pass this to the WordPress back-end,
      // instead of to the React front-end
      if (process.env.NODE_ENV === 'development') {
        // Change format from `/page/my-page/` to `//helsingborg-dsc.local/my-page`
        url = `//helsingborg-dsc.local/${url.slice('/page/'.length)}`;
      }
      return (
        <button
          className={classNames('Link', this.props.className)}
          style={{position: 'relative', overflow: 'hidden'}}
          onClick={() => this.props.openIframe({url})}
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
  openIframe: React.PropTypes.func
};

const mapDispatchToProps = (dispatch) => {
  return {
    openIframe: (url) => dispatch(iframeUrl(url))
  };
};

export default connect(null, mapDispatchToProps)(Link);
