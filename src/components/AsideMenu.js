import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import './AsideMenu.css';

const AsideMenu = ({children, fullHeight}) => (
  <div className={classNames('AsideMenu', {'AsideMenu--fullHeight': fullHeight})}>
    {children}
  </div>
);

export default AsideMenu;

AsideMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  fullHeight: PropTypes.bool
};
