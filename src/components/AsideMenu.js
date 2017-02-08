import React, { Component } from 'react';
import './AsideMenu.css';

export default class AsideMenu extends Component {
  render() {
    return (
      <div className='AsideMenu'>
        {this.props.children}
      </div>
    );
  }
}

AsideMenu.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};
