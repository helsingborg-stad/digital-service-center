import React, { PropTypes } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import './SearchResultOverlay.css';

const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

const truncate = (string) => (string.length > 130) ? string.substring(0, 127) + '...' : string;

const SearchResultOverlayBackdrop = ({children, onClick}) => (
  <div className='SearchResultOverlayBackdrop' onClick={() => onClick()}>{children}</div>
);

SearchResultOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func
};

const SearchResultOverlay =
({searchResults, changeOverlayEvent, pageType, handleHideSearchResult}) => {
  return searchResults !== null ? (
    <SearchResultOverlayBackdrop onClick={handleHideSearchResult}>
      <div className='SearchResultOverlay'>
          <div className='SearchResultOverlay-typeWrapper'>
          <span className='SearchResultOverlay-heading'>Detta hittade vi</span>
          <div className='SearchResultOverlay-listWrapper SearchResultOverlay-listWrapper--type'>
            <span className='SearchResultOverlay-typeHeading'>{pageType}</span>
            <Scrollbars>
              <ul className='SearchResultOverlay-list'>
              {searchResults.length ? searchResults.map(res =>
                <li
                  key={res.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeOverlayEvent(res)
                  }}>
                  {res.imgUrl &&
                    <div className='SearchResultOverlay-imgWrapper'>
                    <img className='SearchResultOverlay-img' src={res.imgUrl} alt={res.name} />
                  </div>
                  }
                  <div className='SearchResultOverlay-contentWrapper'>
                    <span className='SearchResultOverlay-contentHeading'>{res.name}</span>
                    {res.content &&
                      <p>
                        {truncate(stripHtml(res.content))}
                      </p>
                    }
                  </div>
                </li>
              ) : <li>Hittade inga matchande resultat för din sökning</li>}
              </ul>
            </Scrollbars>
          </div>
        </div>
      </div>
    </SearchResultOverlayBackdrop>
  )
  : null;
};

SearchResultOverlay.propTypes = {
  searchResults: PropTypes.array,
  changeOverlayEvent: PropTypes.func,
  pageType: PropTypes.string,
  handleHideSearchResult: PropTypes.func
};

export default SearchResultOverlay;
