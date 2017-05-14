import React from 'react';
import EnFlag from './icons-flags/en-flag';
import SvFlag from './icons-flags/sv-flag';
import { Link } from 'react-router';

import './LanguageFlags.css';

const getLangLink = (activeLang, newLang) => {
  return typeof window === 'undefined'
    ? ''
    : window.location.pathname.replace(`/${activeLang}/`, `/${newLang}/`);
};

const LanguageFlags = ({activeLanguage}) => (

  <div className='LanguageFlags'>
    <Link to={getLangLink(activeLanguage, 'sv')} className='LanguageFlags__link'>
      <SvFlag className='LanguageFlags__flag' />
    </Link>
    <Link to={getLangLink(activeLanguage, 'en')} className='LanguageFlags__link'>
      <EnFlag className='LanguageFlags__flag' />
    </Link>
  </div>
);

export default LanguageFlags;

LanguageFlags.propTypes = {
  activeLanguage: React.PropTypes.string
};
