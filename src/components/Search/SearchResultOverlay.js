import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import './SearchResultOverlay.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
  SearchResultList,
  SearchResultListEventItem,
  SearchResultListCrmItem,
  SearchResultListHbgSeItem,
  SearchResultListAddress
} from './SearchResultList';
import GoogleMapsDirections from '../GoogleMapsDirections';
import { SearchNoResultsFound } from './SearchNotResultsFound';
import { AddressSearchOverlay } from '../OverlayBackdrop';

const SearchResultOverlayBackdrop = ({children, onClick}) => (
  <div className='SearchResultOverlayBackdrop' onClick={() => onClick()}>
    {children}
  </div>
);

SearchResultOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func
};

class SearchResultOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddressDirections: null
    };
  }

  handleSetAddressDirections(directions) {
    this.setState({addressDirections: directions});
  }

  render() {
    const { eventsSearchResults,
      crmSearchResults,
      hbgSeSearchResults,
      addressSearchResults,
      changeOverlayEvent,
      handleHideSearchResult,
      activeLanguage,
      searchInputOnTop,
      translatables,
      searchTerm } = this.props;

    if (this.state.addressDirections) {
      return (
        <AddressSearchOverlay handleClose={this.handleSetAddressDirections.bind(this, null)}>
          <GoogleMapsDirections
            origin={{
              lat: 56.043832,
              lng: 12.6941808
            }}
            destination={{
              lat: this.state.addressDirections.lat,
              lng: this.state.addressDirections.lng
            }}
            handleClose={this.handleSetAddressDirections.bind(this, null)}
            eventName={this.state.addressDirections.address}
            showInformationText={translatables.goBack}
          />
        </AddressSearchOverlay>
      );
    }

    const noResultsFound =
      (eventsSearchResults === null || !eventsSearchResults.length) &&
      (crmSearchResults === null || !crmSearchResults.length) &&
      (hbgSeSearchResults === null || !hbgSeSearchResults.length) &&
      (addressSearchResults === null || !addressSearchResults.length);

    return (
      <ReactCSSTransitionGroup
        transitionName="SearchResultOverlay-transitionGroup"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
        transitionEnter={true}
        transitionLeave={true}
      >
        {(searchInputOnTop) ? (
          <SearchResultOverlayBackdrop onClick={handleHideSearchResult}>
            <ReactCSSTransitionGroup
              transitionName="SearchResultOverlay-transitionGroup"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
              transitionEnter={true}
              transitionLeave={true}
            >
              <div
                className='SearchResultOverlay'
                style={{display: searchTerm ? 'block' : 'none'}}
                onClick={ev => ev.stopPropagation()}
              >
                <span className='SearchResultOverlay-heading'>{translatables.weFoundThis}</span>
                { noResultsFound
                  ?
                  <SearchNoResultsFound
                    text={translatables.noResultsFound}
                    url={translatables.noResultsUrl}
                    handleClick={handleHideSearchResult} />
                  :
                  <div className='SearchResultOverlay-typeWrapper'>
                    { eventsSearchResults !== null && !!eventsSearchResults.length &&
                    <SearchResultList
                      results={eventsSearchResults}
                      heading={translatables.seeAndDiscover}
                      activeLanguage={activeLanguage}
                      changeOverlayEvent={changeOverlayEvent}
                      ItemComponent={SearchResultListEventItem} />
                    }
                    { crmSearchResults !== null && !!crmSearchResults.length &&
                    <SearchResultList
                      results={crmSearchResults}
                      heading={translatables.askCustomerCenter}
                      activeLanguage={activeLanguage}
                      changeOverlayEvent={changeOverlayEvent}
                      ItemComponent={SearchResultListCrmItem} />
                    }
                    { hbgSeSearchResults !== null && !!hbgSeSearchResults.length &&
                    <SearchResultList
                      results={hbgSeSearchResults}
                      heading='Helsingborg.se'
                      activeLanguage={activeLanguage}
                      changeOverlayEvent={changeOverlayEvent}
                      ItemComponent={SearchResultListHbgSeItem} />
                    }
                    { addressSearchResults !== null && !!addressSearchResults.length &&
                    <SearchResultList
                      results={addressSearchResults}
                      heading={translatables.addresses}
                      activeLanguage={activeLanguage}
                      handleSetAddressDirections={this.handleSetAddressDirections.bind(this)}
                      ItemComponent={SearchResultListAddress} />
                    }
                  </div>
                }
              </div>
            </ReactCSSTransitionGroup>
          </SearchResultOverlayBackdrop>
        ) : null}
      </ReactCSSTransitionGroup>
    );
  }
}

SearchResultOverlay.propTypes = {
  searchTerm: PropTypes.string,
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
    askCustomerCenter: PropTypes.string.isRequired,
    goBack: PropTypes.string.isRequired,
    addresses: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables[state.activeLanguage]
  };
};

export default connect(mapStateToProps, null)(SearchResultOverlay);
