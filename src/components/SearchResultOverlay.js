import React, { PropTypes } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import './SearchResultOverlay.css';
import Link from './Link';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const truncate = (string, maxLength = 130) => (string.length > maxLength) ? string.substring(0, maxLength - 3) + '...' : string;

const SearchResultOverlayBackdrop = ({children, onClick}) => (
  <div className='SearchResultOverlayBackdrop' onClick={() => onClick()}>
    {children}
  </div>
);

const getEventUrl = (event, activeLanguage) => {

  let slugForUrl = event.type === 'event' ? event.type : 'local';

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


  return `/${activeLanguage}/${slugForUrl}/${event.slug}`;
};

SearchResultOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func
};

const SearchResultOverlay =
({eventsSearchResults,
  hbgSeSearchResults,
  changeOverlayEvent,
  pageType,
  handleHideSearchResult,
  activeLanguage,
  searchInputOnTop}) => {
  return (
    <ReactCSSTransitionGroup
      transitionName="SearchResultOverlay-transitionGroup"
      transitionEnterTimeout={300}
      transitionLeaveTimeout={300}
      transitionEnter={true}
      transitionLeave={true}
    >
    {(eventsSearchResults !== null || searchInputOnTop) ? (
    <SearchResultOverlayBackdrop onClick={handleHideSearchResult}>
      <ReactCSSTransitionGroup
        transitionName="SearchResultOverlay-transitionGroup"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
        transitionEnter={true}
        transitionLeave={true}
      >
      <div className='SearchResultOverlay' onClick={ev => ev.stopPropagation()}>
        <span className='SearchResultOverlay-heading'>Detta hittade vi</span>
        <div className='SearchResultOverlay-typeWrapper'>
          {eventsSearchResults !== null && (
          <div className='SearchResultOverlay-listWrapper SearchResultOverlay-listWrapper--type'>
            <span className='SearchResultOverlay-typeHeading'>{pageType}</span>
            <Scrollbars>
              <ul className='SearchResultOverlay-list'>
              {eventsSearchResults.length ? eventsSearchResults.map(res =>
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
        )}

        { hbgSeSearchResults && !!hbgSeSearchResults.length &&
        <div className='SearchResultOverlay-listWrapper SearchResultOverlay-listWrapper--type'>
          <span className='SearchResultOverlay-typeHeading'>Fråga Kundcenter</span>
              <Scrollbars>
                <ul className='SearchResultOverlay-list'>
                  <li>Här kommer CRM-frågor dyka upp</li>
                </ul>
              </Scrollbars>
            </div>
        }

        { hbgSeSearchResults && !!hbgSeSearchResults.length &&
        <div className='SearchResultOverlay-listWrapper SearchResultOverlay-listWrapper--type'>
          <span className='SearchResultOverlay-typeHeading'>Helsingborg.se</span>
              <Scrollbars>
                <ul className='SearchResultOverlay-list'>
                {hbgSeSearchResults.length ? hbgSeSearchResults.map(res =>
                  <li key={Math.random()}>
                    <Link style={{textAlign: 'left'}} iframe={{url: res.link}}>
                      <div className='SearchResultOverlay-contentWrapper'>
                        <span className='SearchResultOverlay-contentHeading'>{res.title.split('|')[0]}</span>
                        <p>
                          {truncate(res.description)}
                        </p>
                        <span className='SearchResultOverlay-link'>{truncate(res.link, 50)}</span>
                      </div>
                    </Link>
                  </li>
                  ) : <li>Hittade inga matchande resultat för din sökning</li>}
                </ul>
              </Scrollbars>
            </div>
        }

          </div>
        </div>
      </ReactCSSTransitionGroup>
    </SearchResultOverlayBackdrop>
  )
  : null}
  </ReactCSSTransitionGroup>
  );
};

SearchResultOverlay.propTypes = {
  eventsSearchResults: PropTypes.array,
  hbgSeSearchResults: PropTypes.array,
  changeOverlayEvent: PropTypes.func,
  pageType: PropTypes.string,
  handleHideSearchResult: PropTypes.func,
  activeLanguage: PropTypes.string,
  searchInputOnTop: PropTypes.bool
};

export default SearchResultOverlay;
