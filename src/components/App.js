import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import IframeOverlay from './IframeOverlay';
import { connect } from 'react-redux';
import { iframeUrl } from '../actions/iframeUrl';


const enableTransition = (prevUrl) => {
  // removes /{2chars}/ from string. Example: /sv/ or /en/
  const rxp = /(\/[\w]{2}[\w]?)/;
  return prevUrl.replace(rxp, '') !== window.location.pathname.replace(rxp, '');
};

const App = ({ children, location, iframe, closeIframe, previousUrl}) => (

  <div>
    <ReactCSSTransitionGroup
      component='div'
      transitionName='pageChange'
      transitionEnterTimeout={600}
      transitionLeaveTimeout={600}
      transitionEnter={enableTransition(previousUrl)}
      transitionLeave={enableTransition(previousUrl)}
    >
      {React.cloneElement(children, {
        key: location.pathname
      })}
    </ReactCSSTransitionGroup>
    <ReactCSSTransitionGroup
      component='div'
      transitionName='IframeOverlay-transitionGroup'
      transitionEnterTimeout={300}
      transitionLeaveTimeout={300}
    >
      { iframe &&
      <IframeOverlay
        url={iframe.url} maxWidth={iframe.width} maxHeight={iframe.height}
        offsetTop={iframe.offsetTop} offsetLeft={iframe.offsetLeft} handleClose={closeIframe} />
      }
    </ReactCSSTransitionGroup>
  </div>
);

App.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  location: React.PropTypes.object,
  iframe: React.PropTypes.object,
  closeIframe: React.PropTypes.func,
  previousUrl: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    iframe: state.iframeUrl,
    previousUrl: state.previousUrl
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeIframe: () => dispatch(iframeUrl(null))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
