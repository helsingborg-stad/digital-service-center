import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

import './SearchNoResultsFound.css';

function formatNotFoundText(text, url, handleClick) {
  if (!url) {
    return text;
  }

  function getTextParts(wholeText) {
    const regExp = /{link}.*{\/link}/.exec(wholeText);
    if (!regExp) {
      // If text is malformed, make the whole text a link
      return ['', wholeText, ''];
    }
    const match = regExp[0];
    const offset = regExp.index;
    const linkText = match.replace('{link}', '').replace('{/link}', '');
    const startText = wholeText.substring(0, offset);
    const endText = wholeText.substring(offset + match.length, wholeText.length);
    return [startText, linkText, endText];
  }

  const [startText, linkText, endText] = getTextParts(text);

  return (
    <span>
      {startText}
      <Link className='SearchNoResultsFound__link' iframe={{url}} onClick={handleClick}>
        {linkText}
      </Link>
      {endText}
    </span>);
}

export const SearchNoResultsFound = ({text, url, handleClick}) => (
  <div className='SearchNoResultsFound'>
    { formatNotFoundText(text, url, handleClick) }
  </div>
);

SearchNoResultsFound.propTypes = {
  text: PropTypes.string.isRequired,
  url: PropTypes.string,
  handleClick: PropTypes.func.isRequired
};
