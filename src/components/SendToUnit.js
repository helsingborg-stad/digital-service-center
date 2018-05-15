import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';
import './SendToUnit.css';

class SendToUnit extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onSumbitHandler = (event) => {
    event.preventDefault();
    return;
  }
  render() {
    const eventLink = 'http://www.visithelsingborg.se/event/' + this.props.slug + '?ref=hdsc';
    return (
      <div className='SendToUnit-wrapper'>
        <h1>Lorem Ipsum</h1>
        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis quam ex. Donec ac justo eros. Pellentesque sed mi magna.</span>
        <div className='SendToUnit-QR'>
          <QRCode
            value={eventLink}
            renderAs='svg'
            size='168' />
          <i>Scanna QR Kod</i>
        </div>
        <form className='SendToUnit-form' onSubmit={this.onSumbitHandler}>
          <p>Skicka länk till email: </p>
          <input type='email' name='sendtounit-email' placeholder='E-mail'/>
          <input type="submit" value="Skicka länk" />
        </form>
        {eventLink}
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

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables[state.activeLanguage]
  };
};

export default connect(mapStateToProps)(SendToUnit);
