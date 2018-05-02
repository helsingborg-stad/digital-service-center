import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchField from './SearchField';
import { hbgSeSearchFetchData } from '../../actions/hbgSeSearch';
import { addressSearchFetchData } from '../../actions/addressSearch';
import { crmFetchData } from '../../actions/crm';
import SearchResultOverlay from './SearchResultOverlay';
import Sifter from 'sifter';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import cn from 'classnames';
import './Search.css';

export class Search extends Component {
  constructor() {
    super();
    this.state = {
      eventsSearchResults: null,
      crmSearchResults: null,
      searchInputOnTop: false,
      searchTerm: null,
      landingPagePages: null
    };
  }

  static fetchData({ store, term }) {
    const hbgSeDispatch = store.dispatch(
      hbgSeSearchFetchData(term)
    );
    const addressDispatch = store.dispatch(
      addressSearchFetchData(term)
    );
    return Promise.all([hbgSeDispatch, addressDispatch]);
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      this.props.fetchCrm();
    }

    const landingPagePages = [...this.props.landingPages.visitor.pages
      .filter(p => p.type === 'iframe' || p.type === 'page'),
    ...this.props.landingPages.local.pages
      .filter(p => p.type === 'iframe' || p.type === 'page')];
    this.setState({
      landingPagePages
    });
  }

  handleSearchChange(searchTerm) {
    this.props.fetchData(searchTerm);

    const eventsSifter = new Sifter(this.props.events);
    const eventsSifterResult = eventsSifter.search(searchTerm, {
      fields: ['name', 'content'],
      sort: [{field: 'name', direction: 'asc'}],
      limit: 10
    });

    const resultEvents = this.props.events.filter((event, index) => {
      return eventsSifterResult.items.some(item => item.id === index);
    });

    const landingPagePagesSifter = new Sifter(this.state.landingPagePages);
    const landingPagePagesResult = landingPagePagesSifter.search(searchTerm, {
      fields: ['name'],
      sort: [{field: 'name', direction: 'asc'}],
      limit: 10
    });

    const resultLandingPagePages = this.state.landingPagePages.filter((page, index) => {
      return landingPagePagesResult.items.some(item => item.id === index);
    });

    const crmForCurrentLang = this.props.crm.filter(c => c.language === this.props.activeLanguage);
    const crmSifter = new Sifter(crmForCurrentLang);
    const crmSifterResult = crmSifter.search(searchTerm, {
      fields: ['question', 'answer'],
      sort: [{field: 'question', direction: 'asc'}],
      limit: 10
    });

    const resultCrm = crmForCurrentLang.filter((crmEntry, index) => {
      return crmSifterResult.items.some(item => item.id === index);
    });

    this.setState({
      searchTerm,
      eventsSearchResults: searchTerm ? [...resultEvents, ...resultLandingPagePages] : null,
      crmSearchResults: searchTerm ? resultCrm : null
    });
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
            className={cn('Search-inputWrapper', {'Search-inputWrapper--isActive': this.state.searchInputOnTop}, `Search-inputWrapper--${this.props.pageType}`)}>
            <SearchField
              inline
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
    landingPages: state.landingPages[state.activeLanguage]
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
