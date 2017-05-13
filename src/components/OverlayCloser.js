import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import getElementPosition from '../util/getElementPosition';

import './OverlayCloser.css';

export default class OverlayCloser extends Component {
  render() {
    const { isHidden, onCloseModal, onDismissClose } = this.props;
    return (
      <div
        ref='wrapper'
        className={classNames('OverlayCloser', {'OverlayCloser--hidden': isHidden})}
        onClick={ev => ev.stopPropagation()}
      >
        Stäng rutan?
        <button onClick={onCloseModal}>Ja</button>
        <button onClick={onDismissClose}>Nej</button>
      </div>
    );
  }
}

OverlayCloser.propTypes = {
  isHidden: PropTypes.string,
  onCloseModal: PropTypes.func,
  onDismissClose: PropTypes.func
};

export function setOverlayCloserPosition(backdropEl, overlayCloserEl) {
  const backdropPosition = getElementPosition(backdropEl.currentTarget);
  let xPosition = backdropEl.clientX - backdropPosition.x - (overlayCloserEl.clientWidth / 2);
  if (xPosition < 120) {
    xPosition = 120;
  }
  if (xPosition > 1805) {
    xPosition = 1805;
  }
  let yPosition = backdropEl.clientY - backdropPosition.y - (overlayCloserEl.clientHeight / 2);
  if (yPosition > 1010) {
    yPosition = 1010;
  }
  overlayCloserEl.style.left = xPosition + 'px';
  overlayCloserEl.style.top = yPosition + 'px';
}
