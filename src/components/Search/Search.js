import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchField from './SearchField';
import { hbgSeSearchFetchData } from '../../actions/hbgSeSearch';
import { addressSearchFetchData } from '../../actions/addressSearch';
import { crmFetchData } from '../../actions/crm';
import SearchResultOverlay from './SearchResultOverlay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import cn from 'classnames';
import './Search.css';
import SearchHandler from './SearchHandler';

export class Search extends Component {
  constructor(props) {
    super();

    const landingPagePages = [...props.landingPages.visitor.pages
      .filter(p => p.type === 'iframe' || p.type === 'page'),
    ...props.landingPages.local.pages
      .filter(p => p.type === 'iframe' || p.type === 'page')];

    const searchHandler = new SearchHandler({...props, landingPagePages});

    this.state = {
      eventsSearchResults: null,
      crmSearchResults: null,
      searchInputOnTop: false,
      searchTerm: null,
      landingPagePages: null,
      searchHandler
    };
  }

  componentWillMount() {
    if (typeof window !== 'undefined' && !this.props.crm && !!this.props.crm.length) {
      this.props.fetchCrm();
    }
  }

  handleSearchChange(searchTerm) {
    const searchResult = this.state.searchHandler.search(searchTerm);
    this.setState(searchResult);
  }

  handleSearchInputPosition(searchTerm) {
    if (searchTerm) {
      this.handleSearchChange(searchTerm);
    }

    this.setState({
      searchInputOnTop: true
    });
  }

  handleHideSearchResult() {
    this.setState({
      eventsSearchResults: null,
      searchInputOnTop: false
    });
  }

  changeOverlay(event) {
    this.props.changeOverlayEvent(event);
    this.handleHideSearchResult();
  }

  render() {
    return (
      <div className='Search-wrapper'>
        <ReactCSSTransitionGroup
          transitionName="Search-wrapper-transitionGroup"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
          transitionEnter={true}
          transitionLeave={true}
        >
          <div
            className={cn(
              'Search-inputWrapper',
              `Search-inputWrapper--${this.props.pageType}`,
              {'Search-inputWrapper--isActive': this.state.searchInputOnTop},
              {'Search-inputWrapper--inverted': this.props.invertSearchField
                && this.props.pageType === 'Startpage'})}>
            <SearchField
              inline
              pageType={this.props.pageType}
              autoFocus={false}
              value={this.state.searchTerm || ''}
              onSearchChange={(val) => this.handleSearchChange(val)}
              handleSearchInputPosition={
                (val) => this.handleSearchInputPosition(val, this.props.events)
              }
            />
          </div>
        </ReactCSSTransitionGroup>
        <SearchResultOverlay
          eventsSearchResults={this.state.eventsSearchResults}
          hbgSeSearchResults={(this.state.searchTerm &&
            (this.state.searchTerm in this.props.hbgSeSearch)) ?
            this.props.hbgSeSearch[this.state.searchTerm] : []
          }
          addressSearchResults={(this.state.searchTerm &&
            (this.state.searchTerm in this.props.addressSearch)) ?
            this.props.addressSearch[this.state.searchTerm] : []
          }
          crmSearchResults={this.state.crmSearchResults}
          changeOverlayEvent={this.changeOverlay.bind(this)}
          handleHideSearchResult={this.handleHideSearchResult.bind(this)}
          activeLanguage={this.props.activeLanguage}
          searchInputOnTop={this.state.searchInputOnTop}
          searchTerm={this.state.searchTerm}
        />
      </div>
    );
  }
}

Search.propTypes = {
  changeOverlayEvent: PropTypes.func,
  events: PropTypes.array,
  crm: PropTypes.array,
  landingPages: PropTypes.object,
  activeLanguage: PropTypes.string,
  fetchData: PropTypes.func.isRequired,
  hbgSeSearch: PropTypes.any,
  addressSearch: PropTypes.any,
  fetchCrm: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    searchInputOnTop: state.searchInputOnTop,
    hbgSeSearch: state.hbgSeSearch,
    addressSearch: state.addressSearch,
    crm: state.crm,
    landingPages: state.landingPages[state.activeLanguage],
    invertSearchField: state.siteSettings.useInvertedSearchField
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (term) => {
      dispatch(addressSearchFetchData(term));
      dispatch(hbgSeSearchFetchData(term));
    },
    fetchCrm: () => dispatch(crmFetchData('/api/temp-crm'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
