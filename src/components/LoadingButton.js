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
  style: React.PropTypes.object,
  size: React.PropTypes.string,
  cssClassName: React.PropTypes.string,
  loading: React.PropTypes.bool,
  text: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  spinnerStyle: React.PropTypes.string,
  color: React.PropTypes.string,
  spinnerSize: React.PropTypes.number,
  spinnerColor: React.PropTypes.string,
  spinnerLines: React.PropTypes.number
};

LoadingButton.defaultProps = {
  spinnerLines: 12,
  spinnerColor: '#fff',
  spinnerStyle: 'zoom-out',
  style: {background: '#c70d53'}
};
