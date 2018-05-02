import React from 'react';
import PropTypes from 'prop-types';
import { truncate, getLinkTarget, stripHtml } from './searchHelpers';
import Link from '../Link';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';

import './SearchResultList.css';

export const SearchResultList =
  ({results, heading, activeLanguage, changeOverlayEvent,
    handleSetAddressDirections, ItemComponent }) => {
    return (
      <div className='SearchResultList-listWrapper'>
        <span className='SearchResultList-typeHeading'>
          {heading}
        </span>
        <Scrollbars>
          <ul className='SearchResultList-list'>
            { results.map(res => (
              <li key={Math.random()}>
                <ItemComponent
                  result={res}
                  activeLanguage={activeLanguage}
                  changeOverlayEvent={changeOverlayEvent}
                  handleSetAddressDirections={handleSetAddressDirections} />
              </li>))
            }
          </ul>
        </Scrollbars>
      </div>
    );
  };

SearchResultList.propTypes = {
  results: PropTypes.array.isRequired,
  heading: PropTypes.string.isRequired,
  activeLanguage: PropTypes.string.isRequired,
  changeOverlayEvent: PropTypes.func.isRequired,
  handleSetAddressDirections: PropTypes.func,
  ItemComponent: PropTypes.func.isRequired
};

export const SearchResultListEventItem = ({result, activeLanguage, changeOverlayEvent}) => (
  <Link {...getLinkTarget(result, activeLanguage, changeOverlayEvent)}>
    <div style={{display: 'flex'}}>
      {result.imgUrl &&
      <div className='SearchResultList-imgWrapper'>
        <img className='SearchResultList-img' src={result.imgUrl} alt={result.name} />
      </div>
      }
      <div className='SearchResultList-contentWrapper'>
        <span className='SearchResultList-contentHeading'>{result.name}</span>
        {result.content &&
        <p>
          {truncate(stripHtml(result.content))}
        </p>
        }
      </div>
    </div>
  </Link>
);

SearchResultListEventItem.propTypes = {
  result: PropTypes.object.isRequired,
  activeLanguage: PropTypes.string.isRequired,
  changeOverlayEvent: PropTypes.func.isRequired
};

export const SearchResultListCrmItem = ({result}) => (
  <div className='SearchResultList-contentWrapper'>
    <span className='SearchResultList-contentHeading'>{result.question}</span>
    <p dangerouslySetInnerHTML={
      {__html: stripHtml(result.answer).replace(']]>', '')}} />
  </div>
);

SearchResultListCrmItem.propTypes = {
  result: PropTypes.object.isRequired
};

export const SearchResultListHbgSeItem = ({result}) => (
  <Link style={{textAlign: 'left'}} iframe={{url: result.link}}>
    <div className='SearchResultList-contentWrapper'>
      <span className='SearchResultList-contentHeading'>
        {result.title.split('|')[0]}
      </span>
      <p>
        {truncate(result.description)}
      </p>
      <span className='SearchResultList-link'>{truncate(result.link, 50)}</span>
    </div>
  </Link>
);

SearchResultListHbgSeItem.propTypes = {
  result: PropTypes.object.isRequired
};

const SearchResultListAddressUnconnected
  = ({result, handleSetAddressDirections, takeMeThereText}) => (
    <div key={result.address}>
      <button
        className='SearchResultList-addressButton'
        onClick={() => handleSetAddressDirections(result)}
      >
        {result.address} <span>{takeMeThereText}</span>
      </button>
    </div>
  );

SearchResultListAddressUnconnected.propTypes = {
  result: PropTypes.object.isRequired,
  handleSetAddressDirections: PropTypes.func.isRequired,
  takeMeThereText: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  return {
    takeMeThereText: state.siteSettings.translatables[state.activeLanguage].takeMeThere
  };
};

export const SearchResultListAddress =
  connect(mapStateToProps, null)(SearchResultListAddressUnconnected);
