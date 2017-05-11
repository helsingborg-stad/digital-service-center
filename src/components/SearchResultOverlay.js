import React, { PropTypes } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import './SearchResultOverlay.css';
import Link from './Link';

const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const truncate = (string) => (string.length > 130) ? string.substring(0, 127) + '...' : string;

const SearchResultOverlayBackdrop = ({children, onClick}) => (
  <div className='SearchResultOverlayBackdrop' onClick={() => onClick()}>{children}</div>
);

const getEventUrl = (event, activeLanguage) => {

  let slugForUrl = event.type === 'event' ? event.type : 'local';

  if (event.categories.length) {
    slugForUrl = event.categories.length ? event.categories.reduce((slug, cat) => {
      if (slug === 'event') {
        switch (cat.slug) {
        case 'visitor':
        case 'local':
          slug = cat.slug;
          break;
        default:
          slug = 'event';
          break;

        }
      }
      return slug;
    }, 'event') : 'local';
  }

  return `/${activeLanguage}/${slugForUrl}/${event.slug}`;
};

SearchResultOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func
};

const SearchResultOverlay =
({searchResults, changeOverlayEvent, pageType, handleHideSearchResult, activeLanguage}) => {
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
                <li key={res.id}>
                  <Link to={getEventUrl(res, activeLanguage)} onMouseUp={(e) => {
                    if (window.location.indexOf(res.type) > -1) {
                      e.stopPropagation();
                      changeOverlayEvent(res);
                    }
                  }}>
                    <div style={{display: 'flex'}}>
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
                    </div>
                  </Link>
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
  handleHideSearchResult: PropTypes.func,
  activeLanguage: PropTypes.string
};

export default SearchResultOverlay;
