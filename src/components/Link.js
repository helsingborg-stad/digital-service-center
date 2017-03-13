import React, { PropTypes } from 'react';
import PaperRipple from 'react-paper-ripple';

const Link = ({className, children, href}) => {
  return (
    <PaperRipple tag="a" className={className} href={href}>
      {children}
    </PaperRipple>
  );
}

Link.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export default Link;
