import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';

import languages from '../../../util/languages';

import EnFlag from '../../icons-flags/en-flag';

import './EventSelectLanguage.css';

const promotedLanguages = ['en', 'sv', 'da', 'no', 'de', 'fr', 'nl', 'es', 'it'];

console.log(languages, 'promo');

const SelectLanguage = () => {
  return (
    <div className='EventSelectLanguage'>
      <h2 className='EventSelectLanguage__title'>Select language</h2>
      { promotedLanguages.map(l =>
        <button className={
          cn('EventSelectLanguage__language',
            {'EventSelectLanguage__language--active': l === 'en'}
          )}>
          <EnFlag className='EventSelectLanguage__flag' />
          {languages[l].nativeName}
        </button>
      )}
    </div>
  );
};

export default SelectLanguage;
