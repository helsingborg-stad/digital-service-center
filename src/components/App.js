import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import IframeOverlay from './IframeOverlay';
import { connect } from 'react-redux';
import { iframeUrl } from '../actions/iframeUrl';

const App = ({ children, location, iframe, closeIframe }) => (
  <div>
    <ReactCSSTransitionGroup
      component='div'
      transitionName='pageChange'
      transitionEnterTimeout={600}
      transitionLeaveTimeout={600}
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
      { iframe && <IframeOverlay url={iframe} handleClose={closeIframe} /> }
    </ReactCSSTransitionGroup>
  </div>
);

App.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  location: React.PropTypes.object,
  iframe: React.PropTypes.string,
  closeIframe: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    iframe: state.iframeUrl
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeIframe: () => dispatch(iframeUrl(null))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
