import React, { Component, PropTypes } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import Link from './Link';
import closeCrossSvg from '../media/close-cross.svg';
import './SearchResultOverlay.css';

const SearchResultOverlay = ({searchResults}) => {
  return searchResults && !!searchResults.length ? (
    <div className='SearchResultOverlay'>
        {searchResults.map(res => <div>{res}</div>)}
    </div>
  )
  : null;
};

SearchResultOverlay.propTypes = {
  searchResults: PropTypes.array
};

export default SearchResultOverlay;
