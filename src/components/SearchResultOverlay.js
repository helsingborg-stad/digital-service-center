import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
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
  }, 'local') : 'local';


  return `/${activeLanguage}/${slugForUrl}/${event.slug}`;
};

const getLinkTarget = (res, activeLanguage, changeOverlayEvent) => {
  switch (res.type) {
  case 'iframe':
    return { iframe: {url: res.url} };
  case 'page':
    return { page: {url: res.url} };
  default:
    return {
      to: getEventUrl(res, activeLanguage),
      onMouseUp: (e) => {
        if (window.location.indexOf(res.type) > -1) {
          e.stopPropagation();
          changeOverlayEvent(res);
        }
      }
    };
  }
};

SearchResultOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func
};

const SearchResultOverlay =
({eventsSearchResults,
  crmSearchResults,
  hbgSeSearchResults,
  changeOverlayEvent,
  handleHideSearchResult,
  activeLanguage,
  searchInputOnTop,
  translatables}) => {
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
        <span className='SearchResultOverlay-heading'>{translatables.weFoundThis}</span>
        <div className='SearchResultOverlay-typeWrapper'>
          {eventsSearchResults !== null && (
          <div className='SearchResultOverlay-listWrapper SearchResultOverlay-listWrapper--type'>
            <span className='SearchResultOverlay-typeHeading'>{translatables.seeAndDiscover}</span>
            <Scrollbars>
              <ul className='SearchResultOverlay-list'>
              {eventsSearchResults.length ? eventsSearchResults.map(res =>
                <li key={Math.random()}>
                <Link {...getLinkTarget(res, activeLanguage, changeOverlayEvent)}>
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
              ) : <li>{translatables.noResultsFound}</li>}
            </ul>
          </Scrollbars>
        </div>
        )}

        { crmSearchResults && !!crmSearchResults.length &&
        <div className='SearchResultOverlay-listWrapper SearchResultOverlay-listWrapper--type'>
          <span className='SearchResultOverlay-typeHeading'>{translatables.askCustomerCenter}</span>
              <Scrollbars>
                <ul className='SearchResultOverlay-list'>
                {crmSearchResults.length ? crmSearchResults.map(res =>
                  <li key={Math.random()}>
                    <div className='SearchResultOverlay-contentWrapper' style={{marginLeft: '3rem'}}>
                      <span className='SearchResultOverlay-contentHeading'>{res.question}</span>
                      <p dangerouslySetInnerHTML={{__html: stripHtml(res.answer).replace(']]>', '')}} />
                    </div>
                  </li>
                  ) : <li>{translatables.noResultsFound}</li>}
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
                  ) : <li>{translatables.noResultsFound}</li>}
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
  crmSearchResults: PropTypes.array,
  hbgSeSearchResults: PropTypes.array,
  changeOverlayEvent: PropTypes.func,
  handleHideSearchResult: PropTypes.func,
  activeLanguage: PropTypes.string,
  searchInputOnTop: PropTypes.bool,
  translatables: PropTypes.shape({
    weFoundThis: PropTypes.string.isRequired,
    seeAndDiscover: PropTypes.string.isRequired,
    noResultsFound: PropTypes.string.isRequired,
    askCustomerCenter: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables[state.activeLanguage]
  };
};

export default connect(mapStateToProps, null)(SearchResultOverlay);
