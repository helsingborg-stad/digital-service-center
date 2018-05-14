import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SendToUnit.css';

class SendToUnit extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    console.log('eyo: ', this.props.handleClose);
    return (
      <div className='SendToUnit-wrapper'>
        {this.props.test}
        <button className='GoogleMapsDirections-closeButton' onClick={this.props.handleClose}>
          {this.props.showInformationText}
        </button>
      </div>
    );
  }
}

SendToUnit.propTypes = {
  handleClose: PropTypes.func
};

export default SendToUnit;
