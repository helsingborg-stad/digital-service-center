import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';
import './SendToUnit.css';

class SendToUnit extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  onSumbitHandler = (event) => {
    event.preventDefault();
  }
  render() {
    const eventLink = 'http://www.visithelsingborg.se/event/' + this.props.slug;
    return (
      <div className='SendToUnit-wrapper'>
        <h1>Lorem Ipsum</h1>
        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis quam ex. Donec ac justo eros. Pellentesque sed mi magna.</span>
        <p>
          <QRCode
            value={eventLink}
            renderAs='svg' />
          <i>Scanna QR Kod</i>
        </p>

        <form className='SendToUnit-form' onSubmit={this.onSumbitHandler}>
          <input type='email' name='sendtounit-email' placeholder='E-mail'/>
          <input type="submit" value="Skicka länk" />
        </form>
        <span>{eventLink}</span>
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
