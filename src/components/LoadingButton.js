import PropTypes from 'prop-types';
import React from 'react';
import LaddaButton from 'react-ladda';
import './LoadingButton.css';

export default class LoadingButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      loading: false
    };
  }
  render() {
    return (
      <LaddaButton
        style={this.props.style}
        className={this.props.cssClassName}
        loading={this.state.loading}
        onClick={function () {
          this.setState({loading: !this.state.loading});
          this.props.onClick();
        }.bind(this)}
        data-size={this.props.size}
        data-color={this.props.color}
        data-style={this.props.spinnerStyle}
        data-spinner-size={this.props.spinnerSize}
        data-spinner-lines={this.props.spinnerLines}
        data-spinner-color={this.props.spinnerColor}
      >
        {this.state.text}
      </LaddaButton>
    );
  }
}

LoadingButton.propTypes = {
  style: PropTypes.object,
  size: PropTypes.string,
  cssClassName: PropTypes.string,
  loading: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  spinnerStyle: PropTypes.string,
  color: PropTypes.string,
  spinnerSize: PropTypes.number,
  spinnerColor: PropTypes.string,
  spinnerLines: PropTypes.number
};

LoadingButton.defaultProps = {
  spinnerLines: 12,
  spinnerColor: '#fff',
  spinnerStyle: 'zoom-out',
  style: {background: '#c70d53'}
};
