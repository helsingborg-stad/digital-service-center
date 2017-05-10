import React from 'react';
import EnFlag from './icons-flags/en-flag';
import SvFlag from './icons-flags/sv-flag';
import { Link } from 'react-router';

import './LanguageFlags.css';

const LanguageFlags = ({activeLanguage}) => (

  <div className='LanguageFlags'>
    <Link to={window.location.pathname.replace(`/${activeLanguage}/`, '/sv/')} className='LanguageFlags__link'>
      <SvFlag className='LanguageFlags__flag' />
    </Link>
    <Link to={window.location.pathname.replace(`/${activeLanguage}/`, '/en/')} className='LanguageFlags__link'>
      <EnFlag className='LanguageFlags__flag' />
    </Link>
  </div>
);

export default LanguageFlags;

LanguageFlags.propTypes = {
  activeLanguage: React.PropTypes.string
};
