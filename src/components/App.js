import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import IframeOverlay from './IframeOverlay';
import PageOverlay from './PageOverlay';
import { connect } from 'react-redux';
import { iframeUrl } from '../actions/iframeUrl';
import { pageModalMarkup } from '../actions/pageModalMarkup';

const App = ({ children, location, iframe, closeIframe, pageModal, closePageModal }) => (
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
      { iframe &&
      <IframeOverlay
        url={iframe.url} maxWidth={iframe.width} maxHeight={iframe.height}
        offsetTop={iframe.offsetTop} offsetLeft={iframe.offsetLeft} handleClose={closeIframe} />
      }
    </ReactCSSTransitionGroup>

    <ReactCSSTransitionGroup
      component='div'
      transitionName='PageOverlay-transitionGroup'
      transitionEnterTimeout={300}
      transitionLeaveTimeout={300}
    >
      { pageModal &&
      <PageOverlay
        markup={pageModal} handleClose={closePageModal} />
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
  pageModal: React.PropTypes.string,
  closePageModal: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    iframe: state.iframeUrl,
    pageModal: state.pageModalMarkup
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeIframe: () => dispatch(iframeUrl(null)),
    closePageModal: () => dispatch(pageModalMarkup(null))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
